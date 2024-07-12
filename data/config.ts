import { TConfig } from "@/types/config.type";

export const Config: TConfig = {
  // Image url for avatar.
  AvatarURL: "/images/avatar.webp",
  // Your favorite motto, or a brief self-introduction, for homepage display
  Sentence:
    "基础不牢，地动山摇",
  // Your nickname, or pen name here.
  Nickname: "废材壶",

  // Website main title.
  SiteTitle: "废材壶 BLOG",
  // Your domain for website.
  SiteDomain: "jimhug.info",

  // For the cover image displayed on the homepage, the recommended image aspect ratio is 4:1.
  PageCovers: {
    websiteCoverURL: "/images/cover.webp",
  },

  // Your social platform IDs, and email address.
  SocialLinks: {
    twitter: "hu_hakim", // Twitter ID
    // instagram: "example", // Instagram ID
    github: "jimhug034", // Github ID
    // facebook: "example", // Facebook ID
    // linkedin: "example", // Linkedin ID
    // mastodon: "https://mas.to/@example", // Mastodon link
    email: "jimhug034@gmail.com", // Email address, required.
  },

  // Giscus Configure. Please refer to the https://giscus.app for entire instruction
  Giscus: {
    enabled: true,
    repo: `jimhug034/nextjs-blog`,
    repoId: "R_kgDOLq9cIw",
    category: "Announcements",
    categoryId: "DIC_kwDOLq9cI84CeiG9",
  },

  // Enable the RSS Feed? If not, the feed file will not be generated and the feed entrance will be closed.
  RSSFeed: {
    enabled: true,
  },

  // The supported sponsor ways are wechat-pay, alipay and paypal.
  Sponsor: {
    // Your WechatPay QRCode content.
    WechatPayQRCodeContent: "wxp://f2f02WF-rt0BGFIBQdwam-1F-UZe5Gw7ZdxY_F8ha8ShTfn67xnz4Bdb5yaoa9YuTqAP",
    // Your Alipay link.
    AlipayLink: "https://qr.alipay.com/fkx11614iqfyog9c24ibvd0",
    // Your Paypal user Id.
    // PaypalId: "xxxx",
    // // If it's true, it will show the github sponsor link button.
    // Github: true,
    // // Your Patreon user Id.
    // PatreonId: "xxxx",
    // // Write your crypto wallet address here.
    // Crypto: [
    //   {
    //     Name: "BTC",
    //     Address: "bc1q9mgj2kejx0ag3uu34lp7e6we8cs8z8s6r9les3",
    //     Blockchain: "Bitcoin",
    //   },
    //   {
    //     Name: "ETH",
    //     Address: "0xe42110C65Bf732a9F63e95F15e4e1Cc5963D2e74",
    //     Blockchain: "Ethereum",
    //   },
    //   {
    //     Name: "USDT",
    //     Address: "0xe42110C65Bf732a9F63e95F15e4e1Cc5963D2e74",
    //     Blockchain: "Ethereum",
    //   },
    // ],
  },

  // Website establishment year.
  YearStart: 2024,
  // Please enter your legal name for use with the copyright mark.
  AuthorName: "Jimhug",
};
