import { Navigation } from '@/components/navigation'
import { Hero } from '@/components/hero'
import { BeneficiaryStory } from '@/components/beneficiary-story'
import { MedicalNeed } from '@/components/medical-need'
import { Progress } from '@/components/progress'
import { Donation } from '@/components/donation'
import { DonationImpact } from '@/components/donation-impact'
import { Transparency } from '@/components/transparency'
import { Endorsements } from '@/components/endorsements'
import { Testimonials } from '@/components/testimonials'
import { SocialProof } from '@/components/social-proof'
import { DonationForm } from '@/components/donation-form'
import { ShareSection } from '@/components/share-section'
import { Faq } from '@/components/faq'
import { FinalCta } from '@/components/final-cta'
import { Footer } from '@/components/footer'
import { FloatingActions } from '@/components/floating-actions'

export default function Page() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <BeneficiaryStory />
        <MedicalNeed />
        <Progress />
        <Donation />
        <DonationForm />
        <DonationImpact />
        <Transparency />
        <Endorsements />
        <Testimonials />
        <SocialProof />
        <ShareSection />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <FloatingActions />
    </>
  )
}
