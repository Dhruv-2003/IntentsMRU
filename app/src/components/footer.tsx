import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <div className="text-center py-6 max-w-7xl mx-auto">
      {" "}
      Built by &nbsp;
      <Link
        href={"https://twitter.com/0xdhruva/"}
        className=" hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        0xdhruva
      </Link>
      &nbsp;&&nbsp;
      <Link
        href={"https://twitter.com/kushagrasarathe/"}
        className=" hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        kushagrasarathe
      </Link>{" "}
    </div>
  );
}
