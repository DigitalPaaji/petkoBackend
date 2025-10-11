export const genteratSlug=(title)=>{
const uniquePrefix= `${Math.floor(Math.random() *1000000)}-${Date.now()}`
 
  const slug = title.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');    
  return `${slug}-${uniquePrefix}`;

}