// @ts-nocheck
"use client";

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema, FormValues } from '@/lib/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BotMessageSquare } from 'lucide-react';



const defaultValues: FormValues = {
  headName: '',
  address: '',
  memberCount: 1,
  members: [{ name: '', age: 0, gender: '', maritalStatus: '', religion: '', education: '', occupation: '' }],
  houseOwnership: 'owned',
  amenities: [],
  migrated: 'no',
  migrationReason: '',
};

export function WizardForm() {
  const [step, setStep] = useState(1);
  const [isClient, setIsClient] = useState(false);
  const totalSteps = 9;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: 'onBlur',
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'members',
  });

  // Load from local storage
  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem('census-draft');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        form.reset(parsed);
      } catch (e) {
        console.error("Could not parse saved draft", e);
      }
    }
  }, [form]);

  // Save to local storage on changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/incompatible-library
    const subscription = form.watch((value) => {
      localStorage.setItem('census-draft', JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const memberCount = form.watch('memberCount');
  
  // Adjust members array when count changes
  useEffect(() => {
    const currentLength = fields.length;
    if (memberCount > currentLength) {
      for (let i = currentLength; i < memberCount; i++) {
        append({ name: '', age: 0, gender: '', maritalStatus: '', religion: '', education: '', occupation: '' });
      }
    } else if (memberCount < currentLength) {
      for (let i = currentLength - 1; i >= memberCount; i--) {
        remove(i);
      }
    }
  }, [memberCount, append, remove, fields.length]);

  const nextStep = async () => {
    let valid = false;
    // Basic step validation before proceeding
    if (step === 1) valid = await form.trigger('headName');
    else if (step === 2) valid = await form.trigger('address');
    else if (step === 3) valid = await form.trigger('memberCount');
    else if (step === 4) valid = await form.trigger('members');
    else if (step === 5) valid = await form.trigger('houseOwnership');
    else if (step === 6) valid = true; // checkboxes
    else if (step === 7) valid = await form.trigger(['migrated', 'migrationReason']);
    else valid = true;

    if (valid) setStep((s) => Math.min(s + 1, totalSteps));
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const onSubmit = async () => {
    try {
      const response = await fetch("/api/census/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form.getValues()),
      });
      
      if (!response.ok) {
        throw new Error("Submission failed");
      }
      
      setStep(9); // Show success step
      localStorage.removeItem('census-draft');
    } catch (error) {
      console.error(error);
      alert("Failed to submit census form. Please try again.");
    }
  };

  const downloadJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(form.getValues(), null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "census-draft.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  if (!isClient) return null;

  const AiButton = () => (
    <Button variant="ghost" size="sm" className="ml-2 text-primary hover:text-primary/80 h-6 px-2 text-xs">
      <BotMessageSquare className="w-3 h-3 mr-1" /> Stuck? Ask AI
    </Button>
  );

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg border-2">
      <CardHeader className="bg-primary/5 pb-4">
        <div className="flex justify-between items-center mb-2">
          <CardTitle className="text-2xl text-primary">Self-Enumeration Wizard</CardTitle>
          <span className="text-sm font-medium text-muted-foreground">Step {step} of {totalSteps}</span>
        </div>
        <Progress value={(step / totalSteps) * 100} className="h-2" />
      </CardHeader>
      
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in">
                <h3 className="text-lg font-medium border-b pb-2">1. Household Head Name</h3>
                <FormField
                  control={form.control}
                  name="headName"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center">
                        <FormLabel className="text-base">Full Name</FormLabel>
                        <AiButton />
                      </div>
                      <FormControl>
                        <Input placeholder="Enter head of household name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 animate-in fade-in">
                <h3 className="text-lg font-medium border-b pb-2">2. Address Details</h3>
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center">
                        <FormLabel className="text-base">Current Residential Address</FormLabel>
                        <AiButton />
                      </div>
                      <FormControl>
                        <Input placeholder="Enter full address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 animate-in fade-in">
                <h3 className="text-lg font-medium border-b pb-2">3. Household Size</h3>
                <FormField
                  control={form.control}
                  name="memberCount"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center">
                        <FormLabel className="text-base">Number of Members usually residing</FormLabel>
                        <AiButton />
                      </div>
                      <FormControl>
                        <Input type="number" min={1} max={50} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6 animate-in fade-in">
                <h3 className="text-lg font-medium border-b pb-2 flex items-center justify-between">
                  <span>4. Member Details</span>
                  <AiButton />
                </h3>
                {fields.map((field, index) => (
                  <Card key={field.id} className="p-4 bg-muted/20">
                    <h4 className="font-semibold mb-4 text-primary">Member {index + 1}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField control={form.control} name={`members.${index}.name`} render={({field}) => (
                        <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field}/></FormControl><FormMessage/></FormItem>
                      )} />
                      <FormField control={form.control} name={`members.${index}.age`} render={({field}) => (
                        <FormItem><FormLabel>Age</FormLabel><FormControl><Input type="number" {...field}/></FormControl><FormMessage/></FormItem>
                      )} />
                      <FormField control={form.control} name={`members.${index}.gender`} render={({field}) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || ""}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage/>
                        </FormItem>
                      )} />
                      <FormField control={form.control} name={`members.${index}.maritalStatus`} render={({field}) => (
                        <FormItem>
                          <FormLabel>Marital Status</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || ""}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                            <SelectContent>
                              <SelectItem value="single">Never Married</SelectItem>
                              <SelectItem value="married">Married</SelectItem>
                              <SelectItem value="widowed">Widowed</SelectItem>
                              <SelectItem value="divorced">Divorced</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage/>
                        </FormItem>
                      )} />
                      <FormField control={form.control} name={`members.${index}.religion`} render={({field}) => (
                        <FormItem><FormLabel>Religion</FormLabel><FormControl><Input {...field}/></FormControl><FormMessage/></FormItem>
                      )} />
                      <FormField control={form.control} name={`members.${index}.education`} render={({field}) => (
                        <FormItem><FormLabel>Education Level</FormLabel><FormControl><Input {...field}/></FormControl><FormMessage/></FormItem>
                      )} />
                      <FormField control={form.control} name={`members.${index}.occupation`} render={({field}) => (
                        <FormItem><FormLabel>Occupation</FormLabel><FormControl><Input {...field}/></FormControl><FormMessage/></FormItem>
                      )} />
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {step === 5 && (
              <div className="space-y-4 animate-in fade-in">
                <h3 className="text-lg font-medium border-b pb-2">5. House Ownership</h3>
                <FormField control={form.control} name="houseOwnership" render={({field}) => (
                  <FormItem>
                    <div className="flex items-center"><FormLabel className="text-base">Ownership Status</FormLabel><AiButton /></div>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select ownership" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="owned">Owned</SelectItem>
                        <SelectItem value="rented">Rented</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            )}

            {step === 6 && (
              <div className="space-y-4 animate-in fade-in">
                <h3 className="text-lg font-medium border-b pb-2">6. Household Amenities</h3>
                <div className="flex items-center mb-4"><FormLabel className="text-base">Select available amenities</FormLabel><AiButton /></div>
                
                <FormField control={form.control} name="amenities" render={() => (
                  <FormItem>
                    {['Piped Water', 'Electricity', 'Flush Toilet', 'Internet'].map((item) => (
                      <FormField key={item} control={form.control} name="amenities" render={({ field }) => {
                        return (
                          <FormItem key={item} className="flex flex-row items-start space-x-3 space-y-0 p-2 border rounded-md mb-2">
                            <FormControl>
                              <input 
                                type="checkbox" 
                                className="w-4 h-4 mt-0.5"
                                checked={field.value?.includes(item)}
                                onChange={(e) => {
                                  return e.target.checked
                                    ? field.onChange([...field.value, item])
                                    : field.onChange(field.value?.filter((val) => val !== item))
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">{item}</FormLabel>
                          </FormItem>
                        )
                      }} />
                    ))}
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            )}

            {step === 7 && (
              <div className="space-y-4 animate-in fade-in">
                <h3 className="text-lg font-medium border-b pb-2">7. Migration Details</h3>
                <FormField control={form.control} name="migrated" render={({field}) => (
                  <FormItem>
                    <div className="flex items-center"><FormLabel className="text-base">Has the household migrated from previous residence?</FormLabel><AiButton /></div>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                {form.watch('migrated') === 'yes' && (
                  <FormField control={form.control} name="migrationReason" render={({field}) => (
                    <FormItem className="mt-4">
                      <FormLabel>Reason for Migration</FormLabel>
                      <FormControl><Input placeholder="e.g. Work, Education, Marriage" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                )}
              </div>
            )}

            {step === 8 && (
              <div className="space-y-6 animate-in fade-in">
                <h3 className="text-lg font-medium border-b pb-2">8. Review Application</h3>
                <Card className="bg-muted/10">
                  <CardContent className="pt-6 text-sm space-y-2">
                    <p><strong>Head of Household:</strong> {form.getValues('headName')}</p>
                    <p><strong>Address:</strong> {form.getValues('address')}</p>
                    <p><strong>Total Members:</strong> {form.getValues('memberCount')}</p>
                    <p><strong>House Ownership:</strong> {form.getValues('houseOwnership')}</p>
                    <p><strong>Amenities:</strong> {form.getValues('amenities').join(', ') || 'None'}</p>
                    <p><strong>Migrated:</strong> {form.getValues('migrated')} {form.getValues('migrated') === 'yes' ? `(${form.getValues('migrationReason')})` : ''}</p>
                  </CardContent>
                </Card>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded text-yellow-800 text-sm">
                  <p><strong>Note:</strong> By submitting, you confirm that the information provided is true and correct to the best of your knowledge.</p>
                </div>
              </div>
            )}

            {step === 9 && (
              <div className="py-12 text-center space-y-6 animate-in zoom-in duration-300">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-green-700">Submitted Successfully!</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Your household enumeration data has been successfully saved to the Census 2027 database. Thank you for your contribution.
                </p>
                <div className="pt-4 flex justify-center gap-4">
                  <Button type="button" onClick={() => { window.location.reload(); }}>
                    Start New Survey
                  </Button>
                </div>
              </div>
            )}

            {step < 9 && (
              <div className="flex justify-between pt-6 border-t mt-8">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={prevStep} 
                  disabled={step === 1}
                >
                  Previous
                </Button>
                
                {step < 8 ? (
                  <Button type="button" onClick={nextStep}>Next Step</Button>
                ) : (
                  <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
                    Submit Form
                  </Button>
                )}
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
