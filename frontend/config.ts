import Placeholder1 from "@/assets/placeholders/bear-1.png";
import Placeholder2 from "@/assets/placeholders/bear-2.png";
import Placeholder3 from "@/assets/placeholders/bear-3.png";

export const config: Config = {
  // Removing one or all of these socials will remove them from the page
  socials: {
    twitter: "https://twitter.com",
    discord: "https://discord.com",
    homepage: "https://aptos.io",
  },

  defaultCollection: {
    name: "Insurance Policies Collection",
    description: "A collection of micro and general insurance policies to protect your assets.",
    image: Placeholder1,
  },

  ourStory: {
    title: "Our Story",
    subTitle: "Innovative Insurance Platform on Aptos",
    description:
      "Our platform offers a secure and transparent way to purchase, manage, and claim various insurance products. Join our community and start protecting your assets with ease!",
    discordLink: "https://discord.com",
    images: [Placeholder1, Placeholder2, Placeholder3],
  },

  ourTeam: {
    title: "Our Team",
    members: [
      {
        name: "Alex",
        role: "Blockchain Developer",
        img: Placeholder1,
        socials: {
          twitter: "https://twitter.com",
        },
      },
      {
        name: "Jordan",
        role: "Marketing Specialist",
        img: Placeholder2,
      },
      {
        name: "Taylor",
        role: "Community Manager",
        img: Placeholder3,
        socials: {
          twitter: "https://twitter.com",
        },
      },
    ],
  },

  faqs: {
    title: "F.A.Q.",

    questions: [
      {
        title: "What is Micro Insurance?",
        description:
          "Micro insurance is designed to be affordable for low-income individuals or groups, offering protection for specific risks like health, life, or property.",
      },
      {
        title: "How do I purchase an insurance policy?",
        description: `To purchase an insurance policy:
        1. Navigate to the "Buy Insurance" section in the app.
        2. Select the type of insurance you need.
        3. Fill in the required details and submit your application.
        4. Make the payment through the available payment methods.
        5. Confirm the transaction in your connected wallet.`,
      },
      {
        title: "What types of insurance products are available?",
        description:
          "We offer health insurance, life insurance, and property insurance, each tailored to the specific needs of our customers.",
      },
      {
        title: "How can I file a claim?",
        description: `To file a claim:
        1. Go to the "File a Claim" section in the app.
        2. Provide details about the incident.
        3. Submit any required documentation.
        Our team will review your claim and follow up with the next steps.`,
      },
      {
        title: "What should I do if I encounter an issue with my policy?",
        description: `If you encounter an issue, consider the following:
        1. Verify all details are entered correctly.
        2. Refresh the app and check your policy details again.
        3. Contact our support team for assistance.`,
      },
      {
        title: "How can I view my policy details?",
        description: `To view your policy details:
        1. Navigate to the "My Policies" section of the app.
        2. View all your active policies, including coverage details, premium amounts, and expiration dates.`,
      },
    ],
  },

  nftBanner: [Placeholder1, Placeholder2, Placeholder3],
};

export interface Config {
  socials?: {
    twitter?: string;
    discord?: string;
    homepage?: string;
  };

  defaultCollection?: {
    name: string;
    description: string;
    image: string;
  };

  ourTeam?: {
    title: string;
    members: Array<ConfigTeamMember>;
  };

  ourStory?: {
    title: string;
    subTitle: string;
    description: string;
    discordLink: string;
    images?: Array<string>;
  };

  faqs?: {
    title: string;
    questions: Array<{
      title: string;
      description: string;
    }>;
  };

  nftBanner?: Array<string>;
}

export interface ConfigTeamMember {
  name: string;
  role: string;
  img: string;
  socials?: {
    twitter?: string;
    discord?: string;
  };
}
