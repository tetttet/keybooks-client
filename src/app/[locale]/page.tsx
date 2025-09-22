import Hero from "@/components/Hero";
import HeroVideo from "@/components/HeroVideo";
import Prize from "@/components/Prize";
import StepFour from "@/components/step/StepFour";
import StepOne from "@/components/step/StepOne";
import StepThree from "@/components/step/StepThree";
import StepTwo from "@/components/step/StepTwo";

export default function Home() {
  return (
    <>
      <Hero />
      <HeroVideo />
      <div className="bg-gray-100">
        <div className="max-w-4xl mx-auto py-10 space-y-10">
          <StepOne />
          <StepTwo />
          <StepThree />
          <StepFour />
        </div>
      </div>
      <Prize />
    </>
  );
}
