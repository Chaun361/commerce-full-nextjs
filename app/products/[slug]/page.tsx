import ProductDetails from "@/components/ProductDetails";

export default async function Product({params}: {params: Promise<{slug: string}>}) {
    const { slug } = await params;
  return (
    <ProductDetails slug={slug}></ProductDetails>
  )
}

