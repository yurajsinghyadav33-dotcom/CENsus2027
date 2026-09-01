import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { formSchema } from "@/lib/schema"
import rateLimit from "@/lib/rate-limit"

const limiter = rateLimit({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 500,
})

export async function POST(req: Request) {
  try {
    // 1. Rate Limiting
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1"
    try {
      await limiter.check(5, ip) // 5 requests per minute
    } catch {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 })
    }

    // 2. Authentication Guard (Mock for now, can be enabled later if required)
    const session = await auth()
    // For demo purposes, we will allow anonymous submissions if no session
    const userId = session?.user?.id || "anonymous_user"

    // 3. Validation
    const body = await req.json()
    const validatedData = formSchema.parse(body)

    // 4. Database Transaction
    const household = await prisma.household.create({
      data: {
        headName: validatedData.headName,
        address: validatedData.address,
        memberCount: validatedData.memberCount,
        houseOwnership: validatedData.houseOwnership,
        migrated: validatedData.migrated,
        migrationReason: validatedData.migrationReason,
        amenities: JSON.stringify(validatedData.amenities),
        
        user: {
          connectOrCreate: {
            where: { id: userId },
            create: { id: userId, phone: "0000000000", name: "Anonymous" }
          }
        },
        
        members: {
          create: validatedData.members.map((member) => ({
            name: member.name,
            age: member.age,
            gender: member.gender,
            maritalStatus: member.maritalStatus,
            religion: member.religion,
            education: member.education,
            occupation: member.occupation,
          }))
        }
      }
    })

    return NextResponse.json({ success: true, householdId: household.id })

  } catch (error) {
    console.error("API Error:", error)
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
