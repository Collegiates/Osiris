import { redirect } from "next/navigation";

// Redirect /protected/printers to the first printer for now
export default function PrintersPage() {
  redirect("/protected/printers/printer-1");
}
