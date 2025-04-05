import fs from 'fs';

const categories = [
  {
    name: "בריאות",
    icon: "health_and_safety",
    subcategories: [
      {
        name: "קופת חולים",
        features: [
          { type: "upload", label: "העלאת מסמך רפואי" },
          { type: "reminder", label: "תזכורת לחידוש תרופות" },
          { type: "external_link", label: "שירותים של כללית", url: "https://www.clalit.co.il" },
          { type: "form", label: "טופס החזר כספי" }
        ]
      },
      {
        name: "ביטוח בריאות",
        features: [
          { type: "upload", label: "העלאת פוליסת ביטוח" },
          { type: "reminder", label: "תזכורת לחידוש ביטוח" },
          { type: "external_link", label: "פורטל הביטוח", url: "https://www.insurance.org.il" },
          { type: "form", label: "טופס תביעת ביטוח" }
        ]
      }
    ]
  },
  {
    name: "פיננסים",
    icon: "account_balance",
    subcategories: [
      {
        name: "חשבונות בנק",
        features: [
          { type: "upload", label: "העלאת דפי חשבון" },
          { type: "reminder", label: "תזכורת לתשלומים" },
          { type: "external_link", label: "בנק לאומי", url: "https://www.leumi.co.il" },
          { type: "form", label: "טופס העברה בנקאית" }
        ]
      }
    ]
  },
];

categories.forEach((category, categoryIndex) => {
  category.id = categoryIndex + 1;
  category.subcategories.forEach((subcategory, subcategoryIndex) => {
    subcategory.id = subcategoryIndex + 1;
    subcategory.features.forEach((feature, featureIndex) => {
      feature.id = featureIndex + 1;
    });
  });
});

const output = { categories };
fs.writeFileSync('categories_full_72.json', JSON.stringify(output, null, 2));
console.log('Generated categories_full_72.json with full category data');
