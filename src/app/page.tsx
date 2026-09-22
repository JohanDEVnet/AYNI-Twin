import { AyniApp } from "@/components/ayni-app";
import { students } from "@/data/students";

export default function Home() {
  return <AyniApp students={students} />;
}
