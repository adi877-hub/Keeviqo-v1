

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                               ║${NC}"
echo -e "${BLUE}║                 KEEVIQO 3000+ FILES GENERATOR                 ║${NC}"
echo -e "${BLUE}║                                                               ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════════╝${NC}"

echo -e "${YELLOW}Creating directory structure...${NC}"
mkdir -p src/{components,pages,contexts,hooks,utils,types,assets,locales}/{he,en}
mkdir -p src/components/{ui,forms,layout,data,charts,modals,cards,buttons,inputs}
mkdir -p src/pages/{auth,admin,features,static,categories,subcategories}
mkdir -p src/assets/{images,icons,fonts,logos}
mkdir -p server/{controllers,models,routes,middleware,utils,services,config,validators}
mkdir -p shared/{types,constants,utils,schemas}
mkdir -p public/{images,fonts,icons,logos}
mkdir -p docs/{api,components,deployment,architecture}
mkdir -p tests/{unit,integration,e2e}
mkdir -p scripts/{deployment,database,utils}
mkdir -p config/{development,production,testing}
mkdir -p database/{migrations,seeds,models}
mkdir -p locales/{he,en}
mkdir -p static/{images,css,js}

echo -e "${YELLOW}Creating category-specific directories...${NC}"
for i in {1..72}; do
  mkdir -p src/pages/categories/category-$i
  mkdir -p src/pages/subcategories/category-$i
  mkdir -p src/components/categories/category-$i
  mkdir -p server/routes/categories/category-$i
  mkdir -p database/seeds/categories/category-$i
done

echo -e "${YELLOW}Creating feature-specific directories...${NC}"
mkdir -p src/components/features/{upload,reminder,external_link,form}
mkdir -p src/pages/features/{upload,reminder,external_link,form}
mkdir -p server/routes/features/{upload,reminder,external_link,form}
mkdir -p server/controllers/features/{upload,reminder,external_link,form}

create_component_file() {
  local dir=$1
  local name=$2
  local file="${dir}/${name}.tsx"
  
  echo "import React from 'react';" > "$file"
  echo "" >> "$file"
  echo "interface ${name}Props {" >> "$file"
  echo "  // Props definition" >> "$file"
  echo "}" >> "$file"
  echo "" >> "$file"
  echo "const ${name}: React.FC<${name}Props> = (props) => {" >> "$file"
  echo "  return (" >> "$file"
  echo "    <div className=\"${name,,}\">" >> "$file"
  echo "      {/* Component content */}" >> "$file"
  echo "    </div>" >> "$file"
  echo "  );" >> "$file"
  echo "};" >> "$file"
  echo "" >> "$file"
  echo "export default ${name};" >> "$file"
}

create_utility_file() {
  local dir=$1
  local name=$2
  local file="${dir}/${name}.ts"
  
  echo "/**" > "$file"
  echo " * ${name} utility functions" >> "$file"
  echo " */" >> "$file"
  echo "" >> "$file"
  echo "export const ${name} = {" >> "$file"
  echo "  // Utility methods" >> "$file"
  echo "};" >> "$file"
  echo "" >> "$file"
  echo "export default ${name};" >> "$file"
}

create_type_file() {
  local dir=$1
  local name=$2
  local file="${dir}/${name}.ts"
  
  echo "/**" > "$file"
  echo " * ${name} type definitions" >> "$file"
  echo " */" >> "$file"
  echo "" >> "$file"
  echo "export interface ${name} {" >> "$file"
  echo "  // Type properties" >> "$file"
  echo "}" >> "$file"
  echo "" >> "$file"
  echo "export default ${name};" >> "$file"
}

echo -e "${YELLOW}Creating UI component files...${NC}"
UI_COMPONENTS=("Button" "Card" "Checkbox" "Dialog" "Dropdown" "Input" "Modal" "Pagination" 
               "RadioGroup" "Select" "Slider" "Switch" "Table" "Tabs" "TextArea" "Toast" 
               "Tooltip" "Avatar" "Badge" "Banner" "Calendar" "Carousel" "Collapse" "ColorPicker")

for component in "${UI_COMPONENTS[@]}"; do
  create_component_file "src/components/ui" "$component"
done

echo -e "${YELLOW}Creating utility files...${NC}"
UTILITIES=("api" "auth" "date" "format" "storage" "validation" "notification" "theme" 
           "i18n" "analytics" "logger" "encryption" "file" "qrcode" "pdf" "csv" 
           "excel" "image" "video" "audio" "geolocation" "device" "browser" "network")

for util in "${UTILITIES[@]}"; do
  create_utility_file "src/utils" "$util"
done

echo -e "${YELLOW}Creating type files...${NC}"
TYPES=("auth" "user" "category" "subcategory" "feature" "upload" "reminder" 
       "external_link" "form" "notification" "theme" "language" "settings" 
       "search" "filter" "sort" "pagination" "toast" "modal" "sidebar")

for type in "${TYPES[@]}"; do
  create_type_file "src/types" "$type"
done

echo -e "${YELLOW}Creating category component files...${NC}"
for i in {1..72}; do
  create_component_file "src/components/categories/category-$i" "CategoryCard"
  create_component_file "src/components/categories/category-$i" "CategoryHeader"
  create_component_file "src/components/categories/category-$i" "CategoryFooter"
  create_component_file "src/components/categories/category-$i" "CategoryActions"
  create_component_file "src/components/categories/category-$i" "CategoryFeatures"
  
  create_component_file "src/pages/categories/category-$i" "index"
  create_component_file "src/pages/categories/category-$i" "Details"
  create_component_file "src/pages/categories/category-$i" "Features"
  create_component_file "src/pages/categories/category-$i" "Statistics"
  
  for j in {1..5}; do
    create_component_file "src/pages/subcategories/category-$i" "subcategory-$j"
    create_component_file "src/pages/subcategories/category-$i" "subcategory-$j-details"
    create_component_file "src/pages/subcategories/category-$i" "subcategory-$j-features"
  done
  
  echo "import express from 'express';" > "server/routes/categories/category-$i/index.ts"
  echo "const router = express.Router();" >> "server/routes/categories/category-$i/index.ts"
  echo "" >> "server/routes/categories/category-$i/index.ts"
  echo "// Category $i routes" >> "server/routes/categories/category-$i/index.ts"
  echo "router.get('/', (req, res) => {" >> "server/routes/categories/category-$i/index.ts"
  echo "  res.json({ message: 'Category $i data' });" >> "server/routes/categories/category-$i/index.ts"
  echo "});" >> "server/routes/categories/category-$i/index.ts"
  echo "" >> "server/routes/categories/category-$i/index.ts"
  echo "export default router;" >> "server/routes/categories/category-$i/index.ts"
  
  echo "import { db } from '../../../../server/utils/db';" > "database/seeds/categories/category-$i/seed.ts"
  echo "" >> "database/seeds/categories/category-$i/seed.ts"
  echo "export async function seedCategory$i() {" >> "database/seeds/categories/category-$i/seed.ts"
  echo "  // Seed logic for category $i" >> "database/seeds/categories/category-$i/seed.ts"
  echo "}" >> "database/seeds/categories/category-$i/seed.ts"
done

echo -e "${YELLOW}Creating feature component files...${NC}"
FEATURE_TYPES=("upload" "reminder" "external_link" "form")
for feature in "${FEATURE_TYPES[@]}"; do
  for i in {1..10}; do
    create_component_file "src/components/features/$feature" "${feature^}Component$i"
    create_component_file "src/pages/features/$feature" "${feature^}Page$i"
    
    echo "import express from 'express';" > "server/routes/features/$feature/$feature-$i.ts"
    echo "const router = express.Router();" >> "server/routes/features/$feature/$feature-$i.ts"
    echo "" >> "server/routes/features/$feature/$feature-$i.ts"
    echo "// $feature $i routes" >> "server/routes/features/$feature/$feature-$i.ts"
    echo "router.get('/', (req, res) => {" >> "server/routes/features/$feature/$feature-$i.ts"
    echo "  res.json({ message: '$feature $i data' });" >> "server/routes/features/$feature/$feature-$i.ts"
    echo "});" >> "server/routes/features/$feature/$feature-$i.ts"
    echo "" >> "server/routes/features/$feature/$feature-$i.ts"
    echo "export default router;" >> "server/routes/features/$feature/$feature-$i.ts"
    
    echo "import { Request, Response } from 'express';" > "server/controllers/features/$feature/$feature-controller-$i.ts"
    echo "" >> "server/controllers/features/$feature/$feature-controller-$i.ts"
    echo "export const ${feature}Controller$i = {" >> "server/controllers/features/$feature/$feature-controller-$i.ts"
    echo "  // Controller methods" >> "server/controllers/features/$feature/$feature-controller-$i.ts"
    echo "};" >> "server/controllers/features/$feature/$feature-controller-$i.ts"
    echo "" >> "server/controllers/features/$feature/$feature-controller-$i.ts"
    echo "export default ${feature}Controller$i;" >> "server/controllers/features/$feature/$feature-controller-$i.ts"
  done
done

echo -e "${YELLOW}Creating localization files...${NC}"
echo '{' > "src/locales/he/translation.json"
echo '  "app": {' >> "src/locales/he/translation.json"
echo '    "title": "קיויקו",' >> "src/locales/he/translation.json"
echo '    "subtitle": "ניהול מידע אישי"' >> "src/locales/he/translation.json"
echo '  }' >> "src/locales/he/translation.json"
echo '}' >> "src/locales/he/translation.json"

echo '{' > "src/locales/en/translation.json"
echo '  "app": {' >> "src/locales/en/translation.json"
echo '    "title": "Keeviqo",' >> "src/locales/en/translation.json"
echo '    "subtitle": "Personal Information Management"' >> "src/locales/en/translation.json"
echo '  }' >> "src/locales/en/translation.json"
echo '}' >> "src/locales/en/translation.json"

TOTAL_FILES=$(find . -type f | wc -l)
echo -e "${GREEN}File structure generation complete!${NC}"
echo -e "${GREEN}Total files created: $TOTAL_FILES${NC}"
