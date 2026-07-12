"use client";
import { useParams } from "next/navigation";
import { ItemForm } from "../../ItemForm";
import { CollectionKey } from "../../collections";

export default function NewItemPage() {
  const params = useParams();
  return <ItemForm collectionKey={params.collection as CollectionKey} />;
}
