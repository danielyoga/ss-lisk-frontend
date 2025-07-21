import { Products } from "@/app/types";
import { Metadata } from "next";

export async function generateMetadata({params}: {params: Promise<{slug: string}>}){
    const {slug} = await params;
    const product = await getProductDetail(slug);
    return {
        title: product.title
    }
}

export async function getProductDetail(slug: string): Promise<Products> {
  const data = await fetch(`http://localhost:3001/products?slug=${slug}`);
  const [post] = await data.json();

  return post;
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}) {
  const { slug } = await params;
  const post = await getProductDetail(slug);
  return (
    <div>
      <h1>Product Page</h1>
      <ul>
        <li>{post.id}</li>
        <li>{post.title}</li>
      </ul>
    </div>
  );
}
