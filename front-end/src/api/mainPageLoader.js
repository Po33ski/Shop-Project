import { redirect } from "react-router-dom";
import { PATH_TO_ENDPOINT_MAPPING, BACK_END_URL } from "../constants/api";

export async function mainPageLoader({ params }) {
  const backEndPath = PATH_TO_ENDPOINT_MAPPING[params.gender];
  if (backEndPath) {
    try {
      const response = await fetch(`${BACK_END_URL}/${backEndPath}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error loading main page products:', error);
      throw new Error('Failed to load products');
    }
  } else {
    return redirect("/kobieta");
  }
}
