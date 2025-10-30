import styles from "./Breadcrumbs.module.css";
import { NavLink, useParams } from "react-router-dom";
import ARROW_ICON from "../../assets/arrow.svg";
import { CATEGORIES, GENDERS } from "../../constants/categories";

export function Breadcrumbs() {
  const { gender, category, subcategory } = useParams();

  const foundGender = GENDERS.find((g) => g.path === gender);
  const foundCategory = CATEGORIES.find((c) => c.path === category);

  // Safety check - if gender or category not found, don't render breadcrumbs
  if (!foundGender || !foundCategory) {
    console.warn('Breadcrumbs: Gender or category not found', { gender, category, foundGender, foundCategory });
    return null;
  }

  const breadcrumbs = [
    {
      categoryName: foundGender.categoryName,
      path: `/${foundGender.path}`,
    },
    {
      categoryName: foundCategory.categoryName,
      path: `/${foundGender.path}/${foundCategory.path}`,
    },
  ];

  if (subcategory) {
    const foundSubcategory = foundCategory.subcategories?.find(
      (sc) => sc.path === subcategory
    );

    // Only add subcategory breadcrumb if found
    if (foundSubcategory) {
      breadcrumbs.push({
        categoryName: foundSubcategory.categoryName,
        path: `/${foundGender.path}/${foundCategory.path}/${foundSubcategory.path}`,
      });
    } else {
      console.warn('Breadcrumbs: Subcategory not found', { subcategory, category: foundCategory });
      // Add generic subcategory breadcrumb
      breadcrumbs.push({
        categoryName: subcategory.charAt(0).toUpperCase() + subcategory.slice(1),
        path: `/${foundGender.path}/${foundCategory.path}/${subcategory}`,
      });
    }
  }

  return (
    <ul className={styles.breadcrumbs}>
      {breadcrumbs.map((breadcrumb) => {
        return (
          <li key={breadcrumb.path}>
            <NavLink end to={breadcrumb.path}>
              {breadcrumb.categoryName}
              <img src={ARROW_ICON} />
            </NavLink>
          </li>
        );
      })}
    </ul>
  );
}
