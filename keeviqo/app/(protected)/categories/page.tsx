import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../../components/ui/accordion'
import { categories } from '../../../data/categories'

export const dynamic = 'force-dynamic'

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">קטגוריות</h1>
      <Accordion type="single" collapsible className="w-full">
        {categories.map((cat, idx) => (
          <AccordionItem key={cat.title} value={`item-${idx}`}>
            <AccordionTrigger>{cat.title}</AccordionTrigger>
            <AccordionContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">תתי קטגוריות:</h3>
                  <ul className="list-disc pr-5 space-y-1">
                    {cat.subcategories.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">פיצ'רים חכמים:</h3>
                  <ul className="list-disc pr-5 space-y-1">
                    {cat.smartFeatures.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  {cat.notes.map((n, i) => (
                    <p key={i} className="text-sm text-muted-foreground mb-2">{n}</p>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}