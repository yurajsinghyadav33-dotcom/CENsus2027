import Image from 'next/image';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {useTranslations} from 'next-intl';

export default function PhasesPage() {
  const t = useTranslations('phases');
  // But wait, "जनगणना 2027 के चरण" translates to "Phases of Census 2027". 
  // I will just use t('pageTitle') and add it to the JSONs.

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12 text-primary">{t('pageTitle')}</h1>
      
      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Phase 1 Card */}
        <Card className="overflow-hidden border-2 hover:border-primary transition-colors">
          <div className="h-64 relative bg-orange-50">
            <Image 
              src="/images/phase1.jpg" 
              alt="Houselisting" 
              fill 
              className="object-contain p-4"
            />
          </div>
          <CardHeader>
            <CardTitle className="text-2xl">{t('title1')}</CardTitle>
            <CardDescription className="text-lg font-medium text-orange-600">
              {t('date1')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">
              {t('desc1')}
            </p>
            <h4 className="font-semibold mb-2">{t('key_details1')}</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>{t('list1_1')}</li>
              <li>{t('list1_2')}</li>
              <li>{t('list1_3')}</li>
              <li>{t('list1_4')}</li>
              <li>{t('list1_5')}</li>
            </ul>
          </CardContent>
        </Card>

        {/* Phase 2 Card */}
        <Card className="overflow-hidden border-2 hover:border-primary transition-colors">
          <div className="h-64 relative bg-blue-50">
            <Image 
              src="/images/phase2.jpg" 
              alt="Population Enumeration" 
              fill 
              className="object-contain p-4"
            />
          </div>
          <CardHeader>
            <CardTitle className="text-2xl">{t('title2')}</CardTitle>
            <CardDescription className="text-lg font-medium text-blue-600">
              {t('date2')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">
              {t('desc2')}
            </p>
            <h4 className="font-semibold mb-2">{t('key_details2')}</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>{t('list2_1')}</li>
              <li>{t('list2_2')}</li>
              <li>{t('list2_3')}</li>
              <li>{t('list2_4')}</li>
              <li>{t('list2_5')}</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
