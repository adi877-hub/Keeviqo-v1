import * as React from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { cn } from '../../lib/utils'

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<React.ElementRef<typeof AccordionPrimitive.Item>, React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>>(
  ({ className, ...props }, ref) => (
    <AccordionPrimitive.Item ref={ref} className={cn('border-b', className)} {...props} />
  )
)
AccordionItem.displayName = 'AccordionItem'

const AccordionTrigger = React.forwardRef<React.ElementRef<typeof AccordionPrimitive.Trigger>, React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>>(
  ({ className, children, ...props }, ref) => (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        ref={ref}
        className={cn('flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline', className)}
        {...props}
      >
        {children}
        <span className="ml-2 h-4 w-4 shrink-0 transition-transform [direction:rtl]&data-[state=open]:-rotate-180">▾</span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
)
AccordionTrigger.displayName = 'AccordionTrigger'

const AccordionContent = React.forwardRef<React.ElementRef<typeof AccordionPrimitive.Content>, React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>>(
  ({ className, children, ...props }, ref) => (
    <AccordionPrimitive.Content ref={ref} className={cn('data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up overflow-hidden text-sm', className)} {...props}>
      <div className="pb-4 pt-0">{children}</div>
    </AccordionPrimitive.Content>
  )
)
AccordionContent.displayName = 'AccordionContent'

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }