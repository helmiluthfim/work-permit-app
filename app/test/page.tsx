"use client";

export default function TestPage() {
  const handleClick = async () => {
    const res = await fetch("/api/job-templates", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        kodePekerjaan: "JOB001",
        namaPekerjaan: "Pergantian 1 Phasa",
        createdBy: "686123456789123456789123",
      }),
    });

    const data = await res.json();

    console.log(data);
  };

  return (
    <button onClick={handleClick} className="bg-blue-500 text-white px-4 py-2">
      Test API
    </button>
  );
}
