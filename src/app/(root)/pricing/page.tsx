import { api } from "~/trpc/server"
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger 
} from "~/components/ui/accordion"

import PlansPricing from "~/app/_components/pricing/plans-pricing"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: 'T-Record | Pricing',
  description: 'T-Record Pricing',
}

export default async function Pricing() {
  
  const Faqs = [
    {
      title: 'What are the differences between the starter plan and the T-Record Plus plan?', 
      description: 'The starter plan offers all the basic features for creating markers at any time. On the other hand, the Plus plan not only includes these functionalities but also provides the ability to directly access VOD links from the highlight timeline.'
    },
    {
      title: 'How can I subscribe to the T-Record Plus plan?', 
      description: 'You can upgrade your account to the Plus subscription directly from the platform. Select the Plus plan, follow the indicated steps, and enjoy the additional features, such as direct access to VOD links.'
    },
    {
      title: 'Can I switch between plans at any time?', 
      description: 'Yes, you can switch between the free plan and the Plus plan at any time according to your needs. Simply adjust your plan from your account settings.'
    },
    {
      title: 'How are payments processed for the Plus plan?', 
      description: 'Payments for the Plus plan are securely processed through our platform. You can choose your preferred payment option and manage billing details from your account.'
    },
  ]

  const plans = await api.plans.getAllPlans.query()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b to-[#2e026d] from-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-8 px-4 py-14">
        <h1 className="text-5xl mx-auto md:text-7xl leading-[1.1] max-w-[20ch] text-center text-fluid-base bg-clip-text font-bold">
          Choose your plan and create epic moments live. 
        </h1>
        <h2 className="text-lg text-white text-center animate-fade-down max-w-[50ch] m-auto">
          Stand out with markers, and take your content to the next level.
        </h2>
        <PlansPricing plans={plans} />
        <div className="grid md:flex mb-10 gap-8 items-start mt-10 container">
          <div className="animate-fade-right w-full md:w-2/5">
            <h2 className="text-5xl font-bold text-center">Pricing FAQs</h2>
          </div>
          <div className=" space-y-4 w-full md:w-3/5">
              <Accordion type="single" collapsible className="w-full">
                {Faqs.map((faq, index) => (
                  <AccordionItem className="border-b border-secondary-old/50" key={index} value={`item-${index}`}>
                    <AccordionTrigger>{faq.title}</AccordionTrigger>
                    <AccordionContent>{faq.description}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
          </div>
        </div>
      </div>
    </main>
  );
}

export const dynamic = 'force-dynamic';