"use client";
import { useParams } from "next/navigation";
import { ItemForm } from "../../ItemForm";
import { CollectionKey } from "../../collections";

export default function EditItemPage() {
  const params = useParams();
  return <ItemForm collectionKey={params.collection as CollectionKey} id={params.id as string} />;
}
