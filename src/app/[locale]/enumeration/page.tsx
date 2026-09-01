import { WizardForm } from '@/components/enumeration/WizardForm';

export default function EnumerationPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-10 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-4">Self-Enumeration Form</h1>
        <p className="text-muted-foreground">
          Please fill out the details accurately. Your progress is automatically saved to your device, 
          so you can safely pause and return later. Data is not sent to any external servers during this demo.
        </p>
      </div>
      
      <WizardForm />
    </div>
  );
}
