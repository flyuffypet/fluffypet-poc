import { BreedGuide } from "@/components/seo/breed-guide"
import { notFound } from "next/navigation"

const breedData = {
  "golden-retriever": {
    name: "Golden Retriever",
    species: "Dog",
    origin: "Scotland",
    lifespan: "10-12 years",
    size: "Large",
    temperament: ["Friendly", "Intelligent", "Devoted"],
    commonIssues: ["Hip Dysplasia", "Heart Disease", "Eye Problems"],
    careRequirements: {
      exercise: "High - 2+ hours daily",
      grooming: "Regular brushing, professional grooming every 6-8 weeks",
      training: "Highly trainable, responds well to positive reinforcement",
    },
    description:
      "Golden Retrievers are friendly, intelligent, and devoted dogs. They are among the most popular dog breeds and make excellent family pets.",
  },
  "persian-cat": {
    name: "Persian Cat",
    species: "Cat",
    origin: "Iran (Persia)",
    lifespan: "12-17 years",
    size: "Medium to Large",
    temperament: ["Calm", "Gentle", "Affectionate"],
    commonIssues: ["Breathing Problems", "Eye Issues", "Kidney Disease"],
    careRequirements: {
      exercise: "Low to moderate - indoor play",
      grooming: "Daily brushing required, professional grooming monthly",
      training: "Independent but can learn basic commands",
    },
    description:
      "Persian cats are known for their long, luxurious coats and calm temperament. They make excellent indoor companions.",
  },
  "labrador-retriever": {
    name: "Labrador Retriever",
    species: "Dog",
    origin: "Canada",
    lifespan: "10-14 years",
    size: "Large",
    temperament: ["Outgoing", "Active", "Loyal"],
    commonIssues: ["Hip Dysplasia", "Obesity", "Eye Problems"],
    careRequirements: {
      exercise: "High - 2+ hours daily",
      grooming: "Weekly brushing, occasional baths",
      training: "Highly trainable, eager to please",
    },
    description:
      "Labrador Retrievers are outgoing, active dogs that have more than enough affection to go around for a family looking for a medium-to-large dog.",
  },
}

export default function BreedPage({ params }: { params: { breed: string } }) {
  const breed = breedData[params.breed as keyof typeof breedData]

  if (!breed) {
    notFound()
  }

  return <BreedGuide breed={breed} slug={params.breed} />
}

export async function generateMetadata({ params }: { params: { breed: string } }) {
  const breed = breedData[params.breed as keyof typeof breedData]

  if (!breed) {
    return {
      title: "Breed Not Found - FluffyPet",
    }
  }

  return {
    title: `${breed.name} - Complete Breed Guide | FluffyPet`,
    description: `Learn everything about ${breed.name}s: temperament, care requirements, common health issues, and expert tips for ${breed.species.toLowerCase()} owners.`,
  }
}

export async function generateStaticParams() {
  return Object.keys(breedData).map((breed) => ({
    breed,
  }))
}
