import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (

<section className=" bg-white">
  <div className="flex items-center justify-center bg-gray-900">
    {/* Hero Section */}
    <section className="relative flex items-center justify-center lg:col-span-5 xl:col-span-6 min-h-screen">
      <img />

      <div className="relative p-5 text-center text-white">
        <h2 className="text-2xl font-extrabold sm:text-5xl">Welcome to ReForm  AI Form Builder</h2>
        <p className="mt-4 text-lg opacity-90">Create, automate, and manage forms effortlessly.</p>
      </div>

      {/* SignIn Component - Centered */}
      <div className="flex items-center justify-center w-full">
        <SignIn />
      </div>
    </section>
  </div>
</section>

  ) 
  
 
}