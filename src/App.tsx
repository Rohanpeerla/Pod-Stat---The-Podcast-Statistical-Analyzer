// @ts-nocheck
import { useEffect, useMemo, useState, useRef } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
} from "recharts";

/* ---------- data ---------- */
type TimeRange = "24h" | "7d" | "30d" | "90d";
type Metric = "views" | "listeners" | "watch_hours";
type CategoryFilter = "All" | "Business" | "Comedy" | "True Crime" | "Society" | "Finance" | "Horror" | "Culture";
type PlatformFilter = "All" | "YouTube" | "Spotify" | "JioSaavn" | "Apple";
type LangFilter = "All" | "Hindi" | "Hinglish" | "English";

const indiaTrendSeries = [
  { d: "May 1", views: 18420, listeners: 4210, watch_hours: 9420 },
  { d: "May 4", views: 20110, listeners: 4522, watch_hours: 10340 },
  { d: "May 7", views: 19840, listeners: 4450, watch_hours: 10115 },
  { d: "May 10", views: 22390, listeners: 5019, watch_hours: 11290 },
  { d: "May 13", views: 24012, listeners: 5341, watch_hours: 12180 },
  { d: "May 16", views: 23140, listeners: 5144, watch_hours: 11822 },
  { d: "May 19", views: 25880, listeners: 5812, watch_hours: 13340 },
  { d: "May 22", views: 27004, listeners: 6071, watch_hours: 14022 },
  { d: "May 25", views: 26580, listeners: 5995, watch_hours: 13805 },
  { d: "May 28", views: 28940, listeners: 6488, watch_hours: 15010 },
  { d: "Jun 1", views: 30125, listeners: 6780, watch_hours: 15690 },
  { d: "Jun 4", views: 29220, listeners: 6588, watch_hours: 15230 },
  { d: "Jun 7", views: 31640, listeners: 7099, watch_hours: 16544 },
  { d: "Jun 10", views: 33490, listeners: 7410, watch_hours: 17482 },
  { d: "Jun 13", views: 32150, listeners: 7144, watch_hours: 16790 },
  { d: "Jun 16", views: 34980, listeners: 7760, watch_hours: 18220 },
  { d: "Jun 19", views: 36220, listeners: 8083, watch_hours: 18904 },
  { d: "Jun 22", views: 35770, listeners: 7955, watch_hours: 18512 },
  { d: "Jun 25", views: 38140, listeners: 8429, watch_hours: 19760 },
  { d: "Jun 28", views: 39880, listeners: 8840, watch_hours: 20690 },
  { d: "Jul 1", views: 38420, listeners: 8504, watch_hours: 20011 },
  { d: "Jul 4", views: 40990, listeners: 9073, watch_hours: 21244 },
  { d: "Jul 7", views: 42610, listeners: 9425, watch_hours: 22110 },
  { d: "Jul 10", views: 41880, listeners: 9290, watch_hours: 21782 },
  { d: "Jul 13", views: 44040, listeners: 9722, watch_hours: 22910 },
  { d: "Jul 16", views: 45730, listeners: 10088, watch_hours: 23770 },
  { d: "Jul 19", views: 44910, listeners: 9902, watch_hours: 23240 },
  { d: "Jul 22", views: 47150, listeners: 10394, watch_hours: 24510 },
  { d: "Jul 25", views: 48320, listeners: 10622, watch_hours: 25040 },
  { d: "Jul 28", views: 47290, listeners: 10410, watch_hours: 24480 },
];

const sId = (n:number)=> ["M7lc1UVf-VE","dQw4w9WgXcQ","jNQXAC9IVRw","e-ORhEE9VVg","2Vv-BfVoq4g","OPf0YbXqDm0","fLexgOxsZu0","hTWKbfoikeg"][n%8];

type Show = {
  rank:number; trend:"up"|"down"|"new"|"flat"; delta:number; velocity:"surging"|"rising"|"steady"|"cooling"; growthPct:number;
  podcast:string; channel:string; host:string; category:CategoryFilter; lang:"Hindi"|"English"|"Hinglish";
  platforms: PlatformFilter[]; platformPrimary: PlatformFilter;
  views7d:number; views30d:number; subs:string;
  avgDuration:string; avgDurationSec:number; completion:number;
  youtubeUrl:string; youtubeHandle:string; youtubeId:string;
  spotifyUrl:string; appleUrl:string; jiosaavnUrl:string;
  latestEp:{title:string; mins:number; date:string};
  nextDrop:string; accent:string; tags:string[];
  spark:number[]; cityTop:string;
  chapters:{t:string;sec:number;label:string}[];
  transcript:{sec:number;text:string;lang:"en"|"hi"}[];
};

const baseShows: Show[] = [
  { rank:1, trend:"up", delta:2, velocity:"surging", growthPct:23.4, podcast:"Figuring Out", channel:"Raj Shamani", host:"Raj Shamani", category:"Business", lang:"Hinglish", platforms:["YouTube","Spotify","Apple","JioSaavn"], platformPrimary:"YouTube",
    views7d:9420000, views30d:38200000, subs:"4.82M", avgDuration:"1:08:44", avgDurationSec:4124, completion:71,
    youtubeUrl:"https://www.youtube.com/@RajShamani", youtubeHandle:"@RajShamani", youtubeId:sId(0),
    spotifyUrl:"https://open.spotify.com/show/736rhmW7vilNgkFFo8aDz4",
    appleUrl:"https://podcasts.apple.com/in/podcast/figuring-out-with-raj-shamani/id1538540660",
    jiosaavnUrl:"https://www.jiosaavn.com/shows/figuring-out/1/",
    latestEp:{title:"Nikhil Kamath — building with patience, not hype", mins:68, date:"Jul 28"},
    nextDrop:"Thu 9:00 PM", accent:"#f15a22", tags:["founders","creator economy","india"],
    spark:[42,48,55,52,63,71,84,92,100,96], cityTop:"Mumbai",
    chapters:[{t:"00:00",sec:0,label:"Cold open"},{t:"02:14",sec:134,label:"Zerodha first principles"},{t:"18:40",sec:1120,label:"Patience > speed"},{t:"34:22",sec:2062,label:"India AI startups"},{t:"52:10",sec:3130,label:"Rapid fire"}],
    transcript:[{sec:134,text:"Sabse bada arbitrage India mein abhi patience hai.",lang:"hi"},{sec:134,text:"The biggest arbitrage in India right now is patience.",lang:"en"},{sec:1120,text:"Everyone wants to be viral in 6 months. Companies that win… quiet for 3 years first.",lang:"en"}],
  },
  { rank:2, trend:"down", delta:1, velocity:"steady", growthPct:8.1, podcast:"The Ranveer Show (TRS)", channel:"BeerBiceps", host:"Ranveer Allahbadia", category:"Society", lang:"Hinglish", platforms:["YouTube","Spotify","Apple"], platformPrimary:"YouTube",
    views7d:8890000, views30d:36100000, subs:"7.54M", avgDuration:"1:24:12", avgDurationSec:5052, completion:64,
    youtubeUrl:"https://www.youtube.com/@BeerBiceps", youtubeHandle:"@BeerBiceps", youtubeId:sId(1),
    spotifyUrl:"https://open.spotify.com/show/3ptiw7nOKh5vsMoar79YGc",
    appleUrl:"https://podcasts.apple.com/in/podcast/the-ranveer-show/id150123456",
    jiosaavnUrl:"https://www.jiosaavn.com/shows/the-ranveer-show/",
    latestEp:{title:"Gaur Gopal Das on silent suffering & clarity", mins:84, date:"Jul 26"},
    nextDrop:"Fri 8:00 PM", accent:"#e64b17",
    tags:["spirituality","growth","geopolitics"], spark:[88,86,90,84,91,95,98,93,95,100], cityTop:"Delhi NCR",
    chapters:[{t:"00:00",sec:0,label:"Intro"},{t:"03:11",sec:191,label:"Suffering silently"},{t:"24:05",sec:1445,label:"Clarity framework"},{t:"58:40",sec:3520,label:"India in 2030"}],
    transcript:[{sec:191,text:"Clarity clarity nahi milti, build karni padti hai.",lang:"hi"},{sec:191,text:"Clarity is not found, it is built. 6 questions every morning.",lang:"en"}],
  },
  { rank:3, trend:"up", delta:1, velocity:"rising", growthPct:18.3, podcast:"WTF is with Nikhil Kamath", channel:"WTF Podcast", host:"Nikhil Kamath", category:"Business", lang:"English", platforms:["YouTube","Spotify"], platformPrimary:"YouTube",
    views7d:6110000, views30d:24400000, subs:"1.37M", avgDuration:"56:20", avgDurationSec:3380, completion:68,
    youtubeUrl:"https://www.youtube.com/@nikhil.kamath", youtubeHandle:"@nikhil.kamath", youtubeId:sId(2),
    spotifyUrl:"https://open.spotify.com/show/5T1uhRS6IKKYuo9v0jcSrD",
    appleUrl:"https://podcasts.apple.com/in/podcast/wtf-is/id17000",
    jiosaavnUrl:"https://www.jiosaavn.com/shows/wtf-is/",
    latestEp:{title:"Is India ready for AI-native startups?", mins:56, date:"Jul 24"},
    nextDrop:"Wed 7:30 PM", accent:"#d84210",
    tags:["startups","finance"], spark:[31,37,42,45,51,58,66,73,84,100], cityTop:"Bengaluru",
    chapters:[{t:"00:00",sec:0,label:"Opening"},{t:"04:50",sec:290,label:"AI-native India"},{t:"22:10",sec:1330,label:"Capital cycles"}],
    transcript:[{sec:290,text:"India will leapfrog with distribution-first AI, not model-first.",lang:"en"}],
  },
  { rank:4, trend:"up", delta:4, velocity:"surging", growthPct:31.7, podcast:"The Desi Crime Podcast", channel:"Desi Crime", host:"Aryaan & Aishwarya", category:"True Crime", lang:"English", platforms:["Spotify","Apple","YouTube"], platformPrimary:"Spotify",
    views7d:4380000, views30d:16800000, subs:"542K", avgDuration:"41:10", avgDurationSec:2470, completion:82,
    youtubeUrl:"https://www.youtube.com/@DesiCrimePodcast", youtubeHandle:"@DesiCrimePodcast", youtubeId:sId(3),
    spotifyUrl:"https://open.spotify.com/show/4wgaUiSz7Gh2FJrBYfn0GM",
    appleUrl:"https://podcasts.apple.com/in/podcast/the-desi-crime-podcast/id1508344875",
    jiosaavnUrl:"https://www.jiosaavn.com/shows/the-desi-crime-podcast/",
    latestEp:{title:"Uphaar fire — 27 years later", mins:41, date:"Jul 29"},
    nextDrop:"Tue 6:00 AM", accent:"#b9360c",
    tags:["crime","south asia"], spark:[22,28,33,41,49,62,71,82,94,100], cityTop:"Mumbai",
    chapters:[{t:"00:00",sec:0,label:"Case open"},{t:"06:18",sec:378,label:"Timeline"},{t:"21:44",sec:1304,label:"The missing tapes"}],
    transcript:[{sec:378,text:"At 4:57 PM, the first call went to the fire station. The log says 5:12.",lang:"en"}],
  },
  { rank:5, trend:"flat", delta:0, velocity:"steady", growthPct:4.2, podcast:"Dostcast", channel:"Dostcast", host:"Vinamre Kasanaa", category:"Society", lang:"Hindi", platforms:["YouTube","Spotify"], platformPrimary:"YouTube",
    views7d:3910000, views30d:15200000, subs:"1.12M", avgDuration:"1:31:06", avgDurationSec:5466, completion:59,
    youtubeUrl:"https://www.youtube.com/@Dostcast", youtubeHandle:"@Dostcast", youtubeId:sId(4),
    spotifyUrl:"https://open.spotify.com/show/70vrbHeSvrcXyOeISTyBSy",
    appleUrl:"https://podcasts.apple.com/in/podcast/dostcast/id0",
    jiosaavnUrl:"https://www.jiosaavn.com/shows/dostcast/",
    latestEp:{title:"Aman Dhattarwal — education vs internet", mins:91, date:"Jul 27"},
    nextDrop:"Sat 5:00 PM", accent:"#f2753b",
    tags:["long-form","culture"], spark:[76,78,73,79,81,85,83,88,90,92], cityTop:"Delhi NCR",
    chapters:[{t:"00:00",sec:0,label:"Intro"},{t:"12:05",sec:725,label:"School vs Internet"},{t:"48:30",sec:2910,label:"Creator burnout"}],
    transcript:[{sec:725,text:"Sabse badi problem comparison hai.",lang:"hi"},{sec:725,text:"The biggest problem is comparison.",lang:"en"}],
  },
  { rank:6, trend:"up", delta:3, velocity:"surging", growthPct:27.9, podcast:"The Horror Show — Khooni Monday", channel:"Khooni Monday", host:"Khooni Monday", category:"Horror", lang:"Hindi", platforms:["Spotify","JioSaavn"], platformPrimary:"Spotify",
    views7d:3650000, views30d:14100000, subs:"813K", avgDuration:"28:44", avgDurationSec:1724, completion:87,
    youtubeUrl:"https://www.youtube.com/results?search_query=khooni+monday+horror", youtubeHandle:"Khooni Monday", youtubeId:sId(5),
    spotifyUrl:"https://open.spotify.com/show/2vhxApfLLtI8yCd7hqPokR",
    appleUrl:"https://podcasts.apple.com/in/podcast/the-horror-show-by-khooni-monday/id0",
    jiosaavnUrl:"https://www.jiosaavn.com/shows/the-horror-show/",
    latestEp:{title:"Hostel Room 313 — Patna", mins:29, date:"Jul 28"},
    nextDrop:"Mon & Thu", accent:"#cd3f13",
    tags:["horror","hindi storytelling"], spark:[18,24,31,38,46,55,68,81,93,100], cityTop:"Kolkata",
    chapters:[{t:"00:00",sec:0,label:"Warning"},{t:"01:22",sec:82,label:"Room 313"},{t:"18:40",sec:1120,label:"The knock"}],
    transcript:[{sec:82,text:"Raat ke 2:13 baje, darwaza…",lang:"hi"}],
  },
  { rank:7, trend:"down", delta:2, velocity:"cooling", growthPct:-2.4, podcast:"RealTalk with RealHit", channel:"RealHit", host:"RealHit Team", category:"Culture", lang:"Hinglish", platforms:["YouTube"], platformPrimary:"YouTube",
    views7d:3220000, views30d:13900000, subs:"5.9M", avgDuration:"34:52", avgDurationSec:2092, completion:61,
    youtubeUrl:"https://www.youtube.com/@RealHit", youtubeHandle:"@RealHit", youtubeId:sId(6),
    spotifyUrl:"https://open.spotify.com/show/32MUcqlG23mILmikScDBBB",
    appleUrl:"https://podcasts.apple.com/in/podcast/realtalk/id0",
    jiosaavnUrl:"https://www.jiosaavn.com/shows/realtalk/",
    latestEp:{title:"Gen-Z creators on fame burnout", mins:35, date:"Jul 27"},
    nextDrop:"Sun 11:00 AM", accent:"#f58242",
    tags:["youth","pop culture"], spark:[100,96,92,88,84,83,81,76,72,69], cityTop:"Mumbai",
    chapters:[{t:"00:00",sec:0,label:"Open"},{t:"05:40",sec:340,label:"Burnout talk"}],
    transcript:[{sec:340,text:"Fame ka dopamine is real, par khatam bhi jaldi hota hai.",lang:"hi"}],
  },
  { rank:8, trend:"up", delta:5, velocity:"rising", growthPct:21.1, podcast:"The BarberShop with Shantanu", channel:"The BarberShop", host:"Shantanu Deshpande", category:"Business", lang:"English", platforms:["YouTube","Spotify"], platformPrimary:"YouTube",
    views7d:2890000, views30d:11150000, subs:"687K", avgDuration:"52:17", avgDurationSec:3137, completion:66,
    youtubeUrl:"https://www.youtube.com/@TheBarberShopwithShantanu", youtubeHandle:"@BarberShop", youtubeId:sId(7),
    spotifyUrl:"https://open.spotify.com/search/the%20barbershop%20shantanu",
    appleUrl:"https://podcasts.apple.com/in/podcast/barbershop/id0",
    jiosaavnUrl:"https://www.jiosaavn.com/shows/barbershop/",
    latestEp:{title:"Kunal Shah — time as the real currency", mins:52, date:"Jul 29"},
    nextDrop:"Tue 9:00 PM", accent:"#e35a24",
    tags:["founders","d2c"], spark:[28,34,39,46,54,62,72,83,91,100], cityTop:"Bengaluru",
    chapters:[{t:"00:00",sec:0,label:"Intro"},{t:"07:40",sec:460,label:"Time currency"}],
    transcript:[{sec:460,text:"Your calendar is your cap table.",lang:"en"}],
  },
  { rank:9, trend:"new", delta:0, velocity:"surging", growthPct:41.2, podcast:"Unfiltered by Samdish", channel:"Unfiltered Samdish", host:"Samdish Bhatia", category:"Society", lang:"Hindi", platforms:["YouTube"], platformPrimary:"YouTube",
    views7d:2610000, views30d:8720000, subs:"1.44M", avgDuration:"44:18", avgDurationSec:2658, completion:63,
    youtubeUrl:"https://www.youtube.com/@unfilteredbysamdish", youtubeHandle:"@unfilteredbysamdish", youtubeId:sId(1),
    spotifyUrl:"https://open.spotify.com/show/1laDzehMZxU1RnevOsXq0Z",
    appleUrl:"https://podcasts.apple.com/in/podcast/unfiltered/id0",
    jiosaavnUrl:"https://www.jiosaavn.com/shows/unfiltered/",
    latestEp:{title:"Street interviews — Mumbai local elections", mins:44, date:"Jul 25"},
    nextDrop:"Irregular", accent:"#b8380f",
    tags:["street","politics"], spark:[12,19,28,44,61,74,86,95,98,100], cityTop:"Mumbai",
    chapters:[{t:"00:00",sec:0,label:"On the street"}],
    transcript:[{sec:120,text:"Log kehte hain…",lang:"hi"}],
  },
  { rank:10, trend:"down", delta:1, velocity:"steady", growthPct:1.8, podcast:"Cyrus Says", channel:"Cyrus Broacha", host:"Cyrus Broacha", category:"Comedy", lang:"English", platforms:["Spotify","Apple","YouTube"], platformPrimary:"Spotify",
    views7d:2450000, views30d:9840000, subs:"312K", avgDuration:"38:05", avgDurationSec:2285, completion:72,
    youtubeUrl:"https://www.youtube.com/results?search_query=cyrus+says+podcast", youtubeHandle:"Cyrus Says", youtubeId:sId(2),
    spotifyUrl:"https://open.spotify.com/show/4Njctb1AY3cTv0wOKZkRXE",
    appleUrl:"https://podcasts.apple.com/in/podcast/cyrus-says/id0",
    jiosaavnUrl:"https://www.jiosaavn.com/shows/cyrus-says/",
    latestEp:{title:"Mumbai monsoons & civic comedy", mins:38, date:"Daily"},
    nextDrop:"Daily 8AM", accent:"#d9662a",
    tags:["comedy","news"], spark:[88,90,89,87,91,88,86,87,89,90], cityTop:"Mumbai",
    chapters:[{t:"00:00",sec:0,label:"News roundup"}],
    transcript:[{sec:30,text:"If BMC was a startup…",lang:"en"}],
  },
  { rank:11, trend:"up", delta:2, velocity:"rising", growthPct:14.6, podcast:"The Internet Said So", channel:"TISS", host:"Aadar, Neville, Kautuk, Varun", category:"Comedy", lang:"English", platforms:["YouTube","Spotify"], platformPrimary:"YouTube",
    views7d:2310000, views30d:9210000, subs:"498K", avgDuration:"1:02:40", avgDurationSec:3760, completion:58,
    youtubeUrl:"https://www.youtube.com/results?search_query=the+internet+said+so+podcast", youtubeHandle:"TISS", youtubeId:sId(3),
    spotifyUrl:"https://open.spotify.com/show/0wpMAZCIMXptoGnFvaISNO",
    appleUrl:"https://podcasts.apple.com/in/podcast/tiss/id0",
    jiosaavnUrl:"https://www.jiosaavn.com/shows/the-internet-said-so/",
    latestEp:{title:"Bollywood nostalgia tier list", mins:63, date:"Jul 25"},
    nextDrop:"Thu 1:00 PM", accent:"#f07d43",
    tags:["comedy","pop culture"], spark:[44,48,51,57,64,71,78,84,92,100], cityTop:"Mumbai",
    chapters:[{t:"00:00",sec:0,label:"Cold open"},{t:"09:17",sec:557,label:"Tier list"}],
    transcript:[{sec:557,text:"Kaho Naa… Pyaar Hai is S-tier, fight me.",lang:"en"}],
  },
  { rank:12, trend:"flat", delta:0, velocity:"steady", growthPct:5.9, podcast:"Finance With Sharan", channel:"Sharan Hegde", host:"Sharan Hegde", category:"Finance", lang:"English", platforms:["YouTube","Spotify","JioSaavn"], platformPrimary:"YouTube",
    views7d:2180000, views30d:8850000, subs:"2.61M", avgDuration:"19:44", avgDurationSec:1184, completion:77,
    youtubeUrl:"https://www.youtube.com/@financewithsharan", youtubeHandle:"@financewithsharan", youtubeId:sId(4),
    spotifyUrl:"https://open.spotify.com/search/finance%20with%20sharan",
    appleUrl:"https://podcasts.apple.com/in/podcast/finance-with-sharan/id0",
    jiosaavnUrl:"https://www.jiosaavn.com/shows/finance-with-sharan/",
    latestEp:{title:"Tax mistakes every 26 year old makes", mins:20, date:"Jul 26"},
    nextDrop:"Mon / Fri", accent:"#ea5c1c",
    tags:["personal finance","india"], spark:[70,72,74,73,77,79,81,84,86,89], cityTop:"Bengaluru",
    chapters:[{t:"00:00",sec:0,label:"Intro"},{t:"03:10",sec:190,label:"5 mistakes"}],
    transcript:[{sec:190,text:"80C is not a personality trait.",lang:"en"}],
  },
];

const extraRaw = [
  { rank:13, podcast:"Misfit Humans", channel:"Misfit Humans", host:"Dhruv Athi", category:"Culture" as const, lang:"Hinglish" as const, platforms:["YouTube"] as PlatformFilter[], platformPrimary:"YouTube" as PlatformFilter, views7d:2010000, views30d:7200000, subs:"411K", avgDuration:"47:30", avgDurationSec:2850, completion:70, cityTop:"Pune", accent:"#e46a36", tags:["outsiders"], spark:[32,38,45,53,61,70,78,87,95,100], growthPct:19.4, velocity:"rising" as const, trend:"up" as const, delta:6, nextDrop:"Weekly"},
  { rank:14, podcast:"Simple Ken", channel:"Kenny Sebastian", host:"Kenny Sebastian", category:"Comedy" as const, lang:"English" as const, platforms:["Spotify","YouTube","Apple"] as PlatformFilter[], platformPrimary:"Spotify" as PlatformFilter, views7d:1840000, views30d:7680000, subs:"286K", avgDuration:"58:02", avgDurationSec:3482, completion:65, cityTop:"Bengaluru", accent:"#d85b28", tags:["comedy"], spark:[100,96,93,89,86,84,82,80,79,77], growthPct:-1.2, velocity:"cooling" as const, trend:"down" as const, delta:3, nextDrop:"Bi-weekly"},
  { rank:15, podcast:"Paisa Vaisa", channel:"IVM Podcasts", host:"Anupam Gupta", category:"Finance" as const, lang:"English" as const, platforms:["Spotify","Apple","JioSaavn"] as PlatformFilter[], platformPrimary:"Spotify" as PlatformFilter, views7d:1510000, views30d:6120000, subs:"198K", avgDuration:"31:22", avgDurationSec:1882, completion:74, cityTop:"Mumbai", accent:"#cf4a17", tags:["finance"], spark:[58,61,64,68,72,75,79,83,88,92], growthPct:9.4, velocity:"steady" as const, trend:"up" as const, delta:1, nextDrop:"Wed"},
  { rank:16, podcast:"Maed in India", channel:"Maed in India", host:"Mae Mariyam Thomas", category:"Culture" as const, lang:"English" as const, platforms:["Spotify","JioSaavn","Apple"] as PlatformFilter[], platformPrimary:"Spotify" as PlatformFilter, views7d:1390000, views30d:5440000, subs:"124K", avgDuration:"36:15", avgDurationSec:2175, completion:69, cityTop:"Bengaluru", accent:"#e47b4f", tags:["music"], spark:[64,66,68,70,73,75,78,80,82,84], growthPct:3.5, velocity:"steady" as const, trend:"flat" as const, delta:0, nextDrop:"Weekly"},
  { rank:17, podcast:"Hindi Storytelling — Shivam Tiwari", channel:"The Shivam Show", host:"Shivam Tiwari", category:"Horror" as const, lang:"Hindi" as const, platforms:["YouTube"] as PlatformFilter[], platformPrimary:"YouTube" as PlatformFilter, views7d:1280000, views30d:4710000, subs:"932K", avgDuration:"22:10", avgDurationSec:1330, completion:84, cityTop:"Delhi NCR", accent:"#be3912", tags:["hindi","storytelling"], spark:[11,17,26,38,52,66,78,90,97,100], growthPct:34.8, velocity:"surging" as const, trend:"up" as const, delta:8, nextDrop:"Tue/Fri"},
  { rank:18, podcast:"The Seen and the Unseen", channel:"Amit Varma", host:"Amit Varma", category:"Society" as const, lang:"English" as const, platforms:["Apple","Spotify"] as PlatformFilter[], platformPrimary:"Apple" as PlatformFilter, views7d:1180000, views30d:4980000, subs:"94K", avgDuration:"2:41:00", avgDurationSec:9660, completion:51, cityTop:"Mumbai", accent:"#d15d29", tags:["policy","ideas"], spark:[80,79,81,82,83,84,85,86,87,88], growthPct:2.1, velocity:"steady" as const, trend:"down" as const, delta:2, nextDrop:"Weekly"},
  { rank:19, podcast:"Honestly by Tanmay Bhat", channel:"Honestly", host:"Tanmay Bhat", category:"Comedy" as const, lang:"Hinglish" as const, platforms:["YouTube","Spotify"] as PlatformFilter[], platformPrimary:"YouTube" as PlatformFilter, views7d:1120000, views30d:3890000, subs:"722K", avgDuration:"1:14:52", avgDurationSec:4492, completion:57, cityTop:"Mumbai", accent:"#f16b33", tags:["comedy","creators"], spark:[8,14,24,38,55,71,84,94,99,100], growthPct:52.3, velocity:"rising" as const, trend:"new" as const, delta:0, nextDrop:"Thu"},
  { rank:20, podcast:"Indian Business Podcast", channel:"IBP Network", host:"Shiva Singh", category:"Business" as const, lang:"English" as const, platforms:["Spotify","YouTube"] as PlatformFilter[], platformPrimary:"Spotify" as PlatformFilter, views7d:987000, views30d:4020000, subs:"166K", avgDuration:"44:55", avgDurationSec:2695, completion:67, cityTop:"Hyderabad", accent:"#e2561c", tags:["business"], spark:[41,46,51,58,66,73,81,88,95,100], growthPct:16.7, velocity:"rising" as const, trend:"up" as const, delta:4, nextDrop:"Mon"},
  { rank:21, podcast:"Has It Aged Well?", channel:"IVM Podcasts", host:"Abbas Momin & Urjita Wani", category:"Culture" as const, lang:"Hinglish" as const, platforms:["Spotify","Apple"] as PlatformFilter[], platformPrimary:"Spotify" as PlatformFilter, views7d:902000, views30d:3710000, subs:"88K", avgDuration:"1:06:00", avgDurationSec:3960, completion:62, cityTop:"Mumbai", accent:"#d96831", tags:["bollywood"], spark:[74,75,76,75,77,78,77,78,79,80], growthPct:1.2, velocity:"steady" as const, trend:"down" as const, delta:1, nextDrop:"Paused"},
  { rank:22, podcast:"The Habit Coach", channel:"IVM", host:"Ashdin Doctor", category:"Society" as const, lang:"English" as const, platforms:["JioSaavn","Spotify","Apple"] as PlatformFilter[], platformPrimary:"JioSaavn" as PlatformFilter, views7d:843000, views30d:3410000, subs:"74K", avgDuration:"14:23", avgDurationSec:863, completion:81, cityTop:"Mumbai", accent:"#e96d38", tags:["habits","wellness"], spark:[60,63,66,70,74,78,82,86,90,94], growthPct:11.8, velocity:"steady" as const, trend:"up" as const, delta:3, nextDrop:"Daily short"},
];

const allShows: Show[] = [
  ...baseShows,
  ...extraRaw.map(e=>({
    rank:e.rank, trend:e.trend, delta:e.delta, velocity:e.velocity, growthPct:e.growthPct,
    podcast:e.podcast, channel:e.channel, host:e.host,
    category:e.category, lang:e.lang, platforms:e.platforms, platformPrimary:e.platformPrimary,
    views7d:e.views7d, views30d:e.views30d, subs:e.subs,
    avgDuration:e.avgDuration, avgDurationSec:e.avgDurationSec, completion:e.completion,
    youtubeUrl:`https://www.youtube.com/results?search_query=${encodeURIComponent(e.podcast)}+india`,
    youtubeHandle:"@"+e.channel.replace(/\s+/g,"").toLowerCase().slice(0,14),
    youtubeId: sId(e.rank),
    spotifyUrl:`https://open.spotify.com/search/${encodeURIComponent(e.podcast)}`,
    appleUrl:`https://podcasts.apple.com/in/search?term=${encodeURIComponent(e.podcast)}`,
    jiosaavnUrl:`https://www.jiosaavn.com/search/${encodeURIComponent(e.podcast)}`,
    latestEp:{title:"Latest trending episode", mins:42, date:"Jul 28"},
    nextDrop:e.nextDrop, accent:e.accent, tags:e.tags, spark:e.spark,
    cityTop:e.cityTop,
    chapters:[{t:"00:00",sec:0,label:"Intro"},{t:"08:15",sec:495,label:"Main"}],
    transcript:[{sec:30, text:"India podcasting is hitting an inflection point…", lang:"en" as const}],
  }))
];

/* helpers */
function fmtIn(n:number){ if(n>=10000000) return (n/10000000).toFixed(n%10000000===0?0:1)+"Cr"; if(n>=100000) return (n/100000).toFixed(1)+"L"; if(n>=1000) return (n/1000).toFixed(n>=10000?0:1)+"K"; return n.toString();}
function fmtPlain(n:number){ return new Intl.NumberFormat('en-IN').format(n); }
function fmtMins(sec:number){ const m=Math.floor(sec/60); const s=sec%60; return `${m}m ${s.toString().padStart(2,"0")}s`; }

type UserProfile = { name:string; email:string; provider: "google"|"apple"|"email"|"phone"; avatar:string };

export default function App(){
  const [timeRange,setTimeRange] = useState<TimeRange>("30d");
  const [metric,setMetric] = useState<Metric>("views");
  const [cat,setCat] = useState<CategoryFilter>("All");
  const [plat,setPlat] = useState<PlatformFilter>("All");
  const [langF,setLangF] = useState<LangFilter>("All");
  const [q,setQ] = useState("");

  const [followed,setFollowed] = useState<number[]>([1,2,4,6,8,12]);
  const [queueIds,setQueueIds] = useState<number[]>([3,5,9]);
  const [selected,setSelected] = useState<Show|null>(null);
  const [compareA,setCompareA] = useState<Show|null>(null);
  const [compareB,setCompareB] = useState<Show|null>(null);
  const [showCompare,setShowCompare] = useState(false);

  // AUTH
  const [showAuth,setShowAuth] = useState(false);
  const [authStep,setAuthStep] = useState<"choose"|"email"|"phone"|"otp">("choose");
  const [authEmail,setAuthEmail] = useState("");
  const [authPhone,setAuthPhone] = useState("");
  const [otpValue,setOtpValue] = useState("");
  const [user,setUser] = useState<UserProfile|null>(()=>{
    try { 
      const s = localStorage.getItem("podstat_user"); 
      return s ? JSON.parse(s) : null;
    } catch {return null;}
  });

  const [showLive,setShowLive] = useState(false);
  const [toast,setToast] = useState<string|null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(()=>{ const k=(e:KeyboardEvent)=>{ if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){ e.preventDefault(); searchRef.current?.focus(); } if(e.key==="Escape") setSelected(null); }; window.addEventListener("keydown",k); return()=>window.removeEventListener("keydown",k);},[]);
  useEffect(()=>{ if(toast){ const t=setTimeout(()=>setToast(null),2600); return()=>clearTimeout(t);} },[toast]);
  useEffect(()=>{ if(user) { try{ localStorage.setItem("podstat_user", JSON.stringify(user)); }catch{} } else { try{ localStorage.removeItem("podstat_user"); }catch{}}},[user]);

  const filtered = useMemo(()=> allShows.filter(t =>
    (cat==="All"||t.category===cat) &&
    (plat==="All"||t.platforms.includes(plat)) &&
    (langF==="All"||t.lang===langF) &&
    (q===""|| (t.podcast+t.channel+t.host+t.tags.join(" ")).toLowerCase().includes(q.toLowerCase()))
  ),[cat,plat,langF,q]);

  const allMarket7d = useMemo(()=> allShows.reduce((a,b)=>a+b.views7d,0), []);
  const total7d = filtered.reduce((a,b)=>a+b.views7d,0);
  const total30d = filtered.reduce((a,b)=>a+b.views30d,0);
  const filteredShare = total7d / (allMarket7d||1);

  const avgCompletion = filtered.length ? Math.round(filtered.reduce((a,s)=>a + s.completion * s.views7d,0) / total7d) : 0;
  const avgDurSec = filtered.length ? Math.round(filtered.reduce((a,s)=>a + s.avgDurationSec * s.views7d,0) / total7d) : 0;
  const avgGrowth = filtered.length ? (filtered.reduce((a,s)=>a+s.growthPct,0)/filtered.length).toFixed(1) : "0";

  const baseChart = useMemo(()=>{
    if(timeRange==="24h") return [
      {d:"00",views:1450,listeners:322,watch_hours:752},
      {d:"03",views:610,listeners:142,watch_hours:334},
      {d:"06",views:980,listeners:228,watch_hours:508},
      {d:"09",views:2140,listeners:490,watch_hours:1104},
      {d:"12",views:2980,listeners:670,watch_hours:1540},
      {d:"15",views:2740,listeners:612,watch_hours:1412},
      {d:"18",views:3420,listeners:759,watch_hours:1788},
      {d:"21",views:3890,listeners:859,watch_hours:1994},
    ];
    if(timeRange==="7d") return indiaTrendSeries.slice(-7);
    if(timeRange==="30d") return indiaTrendSeries.slice(-12);
    return indiaTrendSeries;
  },[timeRange]);

  const blendedSpark = useMemo(()=>{
    if(!filtered.length) return Array(baseChart.length).fill(1);
    const w = filtered.reduce((a,s)=>a+s.views7d,0)||1;
    return baseChart.map((_,i)=>{
      let v=0;
      filtered.forEach(s=>{
        const sp=s.spark;
        const idx=Math.floor(i / baseChart.length * sp.length);
        v += (sp[Math.min(idx, sp.length-1)]/100) * (s.views7d/w);
      });
      return 0.55 + v*0.9;
    });
  },[filtered, baseChart]);

  const chartData = useMemo(()=> baseChart.map((p,i)=>{
    const shape = blendedSpark[i] ?? 1;
    const f = filteredShare * shape;
    return { d:p.d, views:Math.round(p.views*f), listeners:Math.round(p.listeners*f), watch_hours:Math.round(p.watch_hours*f) };
  }),[baseChart, filteredShare, blendedSpark]);

  const platformDist = useMemo(()=>{
    const map: Record<string,number> = {YouTube:0, Spotify:0, JioSaavn:0, Apple:0};
    filtered.forEach(s=>{ map[s.platformPrimary]=(map[s.platformPrimary]||0)+s.views7d; });
    const total = Object.values(map).reduce((a,b)=>a+b,0)||1;
    return [
      { name:"YouTube", value: Math.round(map.YouTube/total*100), color:"#f24d1b" },
      { name:"Spotify", value: Math.round(map.Spotify/total*100), color:"#ea6d35" },
      { name:"JioSaavn", value: Math.round(map.JioSaavn/total*100), color:"#f7a372" },
      { name:"Apple", value: Math.max(0, Math.round(map.Apple/total*100)), color:"#f2d0b6" },
    ].filter(d=>d.value>0);
  },[filtered]);

  const langDist = useMemo(()=>{
    const b: Record<string,number> = {};
    filtered.forEach(s=>{ b[s.lang]=(b[s.lang]||0)+s.views7d; });
    const total = Object.values(b).reduce((a,c)=>a+c,0)||1;
    const colors: Record<string,string> = {Hinglish:"#f45a24", English:"#f5844a", Hindi:"#f4b989"};
    return Object.entries(b).map(([label,v])=>({ label, pct: Math.round(v/total*100), color: colors[label]||"#ead3b9"})).sort((a,b)=>b.pct-a.pct);
  },[filtered]);

  const cityDist = useMemo(()=>{
    const m: Record<string,number> = {};
    filtered.forEach(s=>{ m[s.cityTop]=(m[s.cityTop]||0)+Math.round(s.views7d*0.34); });
    const total = Object.values(m).reduce((a,b)=>a+b,0)||1;
    const cols = ["#f45d22","#f67b3a","#f9a067","#f2c298","#ead1b4","#e4d7c7","#ddd3c6","#d9cec1"];
    return Object.entries(m).map(([city,listeners],i)=>({ city, listeners, share: +(listeners/total*100).toFixed(1), color:cols[i%cols.length]})).sort((a,b)=>b.share-a.share).slice(0,8);
  },[filtered]);

  const topBarData = useMemo(()=> filtered.slice(0,8).map(s=>({
    name: s.podcast.slice(0,19),
    views: +(s.views7d/1000000).toFixed(2),
    fill: s.accent
  })),[filtered]);

  const retentionCurve = useMemo(()=>{
    const base = [
      {pct:0,audience:100},{pct:5,audience:96.2},{pct:10,audience:92.5},{pct:15,audience:89.1},
      {pct:20,audience:86.4},{pct:25,audience:83.9},{pct:30,audience:81.8},{pct:35,audience:79.7},
      {pct:40,audience:77.6},{pct:45,audience:75.3},{pct:50,audience:73.0},{pct:55,audience:71.1},
      {pct:60,audience:69.2},{pct:65,audience:66.8},{pct:70,audience:64.5},{pct:75,audience:60.2},
      {pct:80,audience:54.7},{pct:85,audience:48.3},{pct:90,audience:38.9},{pct:95,audience:29.4},{pct:100,audience:21.6},
    ];
    const shift = (avgCompletion - 68.4) * 0.38;
    return base.map(b=>({ pct:b.pct, audience: Math.max(8, Math.min(100, +(b.audience + shift - b.pct*0.02).toFixed(1))) }));
  },[avgCompletion]);

  const toggleFollow = (r:number)=>{ if(!user){ setShowAuth(true); setToast("Sign in to follow channels"); return;} setFollowed(f=> f.includes(r)? f.filter(x=>x!==r):[...f,r]); setToast(followed.includes(r)?"Unfollowed":"Following ✓"); };
  const toggleQueue = (r:number)=>{ setQueueIds(q=> q.includes(r)? q.filter(x=>x!==r):[...q,r]); };

  const activeFilterLabel = [cat!=="All"?cat:null, plat!=="All"?plat:null, langF!=="All"?langF:null, q?`"${q}"`:null].filter(Boolean).join(" • ") || "India • All";

  const doGoogleLogin = ()=>{
    // simulate OAuth
    const p = { name:"Arielle Ngo", email:"arielle.ngo@gmail.com", provider:"google" as const, avatar:"https://i.pravatar.cc/120?img=32" };
    setUser(p);
    setShowAuth(false);
    setAuthStep("choose");
    setToast("Signed in with Google • Pro unlocked");
  };
  const doAppleLogin = ()=>{
    const p = { name:"Arielle Ngo", email:"arielle@icloud.com", provider:"apple" as const, avatar:"https://i.pravatar.cc/120?img=5" };
    setUser(p);
    setShowAuth(false);
    setAuthStep("choose");
    setToast("Signed in with Apple • Pro unlocked");
  };
  const doEmailOtp = ()=>{
    if(authStep==="email"){ setAuthStep("otp"); setToast("OTP sent to "+authEmail); return; }
    if(authStep==="otp" && otpValue.length>=4){
      setUser({ name: authEmail.split("@")[0], email: authEmail, provider:"email", avatar:"https://i.pravatar.cc/120?img=12"});
      setShowAuth(false); setAuthStep("choose"); setOtpValue(""); setToast("Email verified • signed in");
    }
  };
  const doPhoneOtp = ()=>{
    if(authStep==="phone"){ setAuthStep("otp"); setToast("OTP sent to +91 "+authPhone); return; }
    if(authStep==="otp" && otpValue.length>=4){
      setUser({ name:"IN User", email:"+91"+authPhone+"@podstat.in", provider:"phone", avatar:"https://i.pravatar.cc/120?img=15"});
      setShowAuth(false); setAuthStep("choose"); setOtpValue(""); setToast("Phone verified • signed in");
    }
  };
  const signOut = ()=>{ setUser(null); setToast("Signed out"); };

  return (
    <div className="min-h-screen bg-[#f5f0e8] text-[#17161c]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400..700&family=Fragment+Mono&family=Inter:wght@400;500;600;700&display=swap');
        body{font-family:Inter,ui-sans-serif,system-ui,sans-serif;background:#f5f0e8}
        .font-display{font-family:"Fraunces",ui-serif,Georgia,serif}
        .font-mono-s{font-family:"Fragment Mono",ui-monospace,monospace}
        ::-webkit-scrollbar{height:8px;width:8px}::-webkit-scrollbar-thumb{background:#d9cdb9;border-radius:8px}
      `}</style>

      <div className="flex">
        {/* sidebar */}
        <aside className="hidden xl:flex w-[284px] min-h-screen bg-[#101016] text-zinc-300 sticky top-0 flex-col">
          <div className="px-[24px] pt-[28px] pb-[18px] border-b border-zinc-800/90">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-[15px] bg-gradient-to-br from-[#ff6b2b] to-[#d63e07] flex items-center justify-center shadow-lg"><span className="text-white font-[700] text-[15px] tracking-tight">pd</span></div>
              <div>
                <div className="text-[19px] text-white font-[700] tracking-[-0.015em] font-display">podstat</div>
                <div className="text-[11px] text-zinc-500 font-mono-s uppercase tracking-wider -mt-[2px]">India • analytics</div>
              </div>
            </div>

            {/* user chip */}
            {user ? (
              <div className="mt-[15px] bg-[#181821] border border-zinc-800 rounded-[14px] px-3 py-[10px] flex items-center gap-3">
                <img src={user.avatar} alt="" className="w-9 h-9 rounded-full ring-1 ring-zinc-700"/>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] text-white truncate">{user.name}</div>
                  <div className="text-[11px] text-zinc-400 truncate">{user.email} • {user.provider}</div>
                </div>
                <button onClick={signOut} className="text-[10.5px] text-zinc-400 hover:text-zinc-200">out</button>
              </div>
            ) : (
              <button onClick={()=>{setShowAuth(true); setAuthStep("choose");}} className="mt-[15px] w-full bg-[#1b1b24] hover:bg-[#222233] transition border border-zinc-800 rounded-[14px] px-3 py-[11px] text-left">
                <div className="text-[12.5px] text-zinc-300">Sign in to unlock Pro</div>
                <div className="text-[11.5px] text-zinc-500 mt-[2px]">Google • Apple • Email • +91</div>
              </button>
            )}

            <div className="mt-3 grid grid-cols-2 gap-2 text-[11.3px]">
              <button onClick={()=>setShowAuth(true)} className="bg-[#1a1a23] border border-zinc-800 rounded-[12px] px-[10px] py-[8px] text-left hover:bg-[#20202c]">
                <div className="text-zinc-500">Account</div>
                <div className="font-[600] text-white">{user ? "Pro ✓" : "Sign in →"}</div>
              </button>
              <button onClick={()=>setShowLive(true)} className="bg-[#1a1a23] border border-zinc-800 rounded-[12px] px-[10px] py-[8px] text-left hover:bg-[#20202c]">
                <div className="text-zinc-500">Auto-update</div>
                <div className="font-[600] text-white">Daily 6:30</div>
              </button>
            </div>
          </div>

          <nav className="px-[16px] pt-5 flex-1 overflow-y-auto">
            <div className="text-[10.5px] uppercase tracking-[0.115em] text-zinc-500 font-mono-s px-3 mb-2">Analytics</div>
            {[
              ["India Trending",true],
              ["My Up Next",false, queueIds.length],
              ["Following",false, followed.length],
              ["Compare channels",false],
            ].map(([n,on,b]:any)=>(
              <a key={n} href="#" onClick={e=>{e.preventDefault(); if(n==="Compare channels") setShowCompare(true);}}
                className={`flex items-center justify-between px-3 h-[39px] rounded-[12px] text-[13.3px] mb-[2px] ${on ? "bg-[#f65818] text-white" : "text-zinc-400 hover:text-zinc-100 hover:bg-[#18181f]"}`}>
                <span>{n}</span>
                {b ? <span className="text-[10.5px] px-1.5 py-[2px] rounded-full bg-[#23232f] text-zinc-300">{b}</span> : null}
              </a>
            ))}

            <div className="mt-6 text-[10.5px] uppercase tracking-[0.115em] text-zinc-500 font-mono-s px-3 mb-2">Active filter</div>
            <div className="mx-3 rounded-[14px] bg-[#181822] border border-zinc-800 px-3 py-[11px] text-[12.4px] text-zinc-300">
              <div className="font-[550] text-zinc-100">{activeFilterLabel}</div>
              <div className="text-[11.5px] text-zinc-400 mt-1">{filtered.length} shows • {fmtIn(total7d)} 7d • {avgCompletion}% finish</div>
              {(cat!=="All"||plat!=="All"||langF!=="All"||q) && (
                <button onClick={()=>{setCat("All");setPlat("All");setLangF("All");setQ("");}} className="text-[11px] text-[#ff9a68] hover:underline mt-2">Reset → All India</button>
              )}
            </div>

            <div className="mt-6 mx-3 rounded-[16px] bg-gradient-to-b from-[#22222b] to-[#181822] border border-zinc-800 p-[14px] text-[12.3px] text-zinc-300">
              {!user ? (
                <>
                  <div className="font-[600] text-zinc-100">Sign in to unlock</div>
                  <ul className="mt-2 text-zinc-400 space-y-1 text-[12px]">
                    <li>• Follow sync</li>
                    <li>• Queue cloud</li>
                    <li>• Drop alerts</li>
                    <li>• Notes & export</li>
                  </ul>
                  <button onClick={()=>setShowAuth(true)} className="mt-3 w-full py-[8px] rounded-[11px] bg-[#f85818] text-white text-[12.5px] font-[600]">Sign in — Google / Apple</button>
                </>
              ) : (
                <>
                  <div className="font-[600] text-zinc-100">Pro active ✓</div>
                  <div className="text-zinc-400 text-[12px] mt-1">Follow {followed.length} • Queue {queueIds.length}</div>
                  <button onClick={()=>setShowCompare(true)} className="mt-3 w-full py-[8px] rounded-[11px] bg-[#23232f] text-zinc-200 text-[12px]">Compare channels</button>
                </>
              )}
            </div>
          </nav>

          <div className="px-5 pb-5 pt-4 border-t border-zinc-800/80 text-[11.5px] text-zinc-500">
            podstat • IN-PULSE<br/>
            {user ? <>Signed in • {user.provider}</> : <>Sign-in optional</>} • <button className="underline decoration-dotted text-zinc-300" onClick={()=>setShowAuth(true)}>account →</button>
          </div>
        </aside>

        {/* main */}
        <div className="flex-1 min-w-0">
          <div className="px-5 sm:px-9 lg:px-[46px] pt-[30px] md:pt-[44px] pb-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-[11.5px] text-zinc-500 font-mono-s">
                  <span>Analytics</span><span>/</span><span className="text-zinc-700">India Trending</span>
                  <span className="px-[9px] py-[3px] rounded-full text-[10.5px] bg-[#ebe1d2] text-[#8b5b31]">LIVE • IST</span>
                  <span className="px-[9px] py-[3px] rounded-full text-[10.5px] bg-[#fff1e7] text-[#cf4a17] border border-[#ffd0b8]">filter-reactive</span>
                </div>
                <h1 className="font-display text-[36px] sm:text-[48px] leading-[0.93] tracking-[-0.022em] mt-[10px] text-[#15131a]">
                  Podcasts trending now<br className="hidden sm:block"/> in India
                </h1>
                <p className="mt-3 text-[14.5px] text-zinc-600 max-w-[800px] leading-relaxed">
                  Downloads chart • listener geography • average duration • top episodes — <b>all redraw instantly</b> when you change Category, Platform, or Language.
                  <span className="ml-2 text-zinc-500">22 shows • updated 2 min ago.</span>
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {user ? (
                  <div className="flex items-center gap-2 bg-white border border-[#e3dbcd] rounded-[14px] px-3 py-[8px] shadow-sm">
                    <img src={user.avatar} className="w-7 h-7 rounded-full" alt="" />
                    <div className="text-[12.5px] leading-tight">
                      <div className="font-[550] text-zinc-900">{user.name}</div>
                      <div className="text-[11px] text-zinc-500">{user.provider} • Pro</div>
                    </div>
                    <button onClick={signOut} className="text-[11px] text-zinc-500 ml-2 hover:text-zinc-800">out</button>
                  </div>
                ) : (
                  <button onClick={()=>{setShowAuth(true); setAuthStep("choose");}} className="px-4 py-[9px] rounded-[13px] bg-[#15131b] text-white text-[13px] shadow-[0_8px_24px_rgba(20,15,30,0.14)]">
                    Sign in — Google / Apple
                  </button>
                )}
                <button onClick={()=>setShowLive(true)} className="px-[14px] py-[9px] bg-white border border-[#e3dbcd] rounded-[14px] text-[13px] text-zinc-700 shadow-sm">Live updates</button>
              </div>
            </div>

            {/* filters */}
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-[250px] max-w-[500px] relative">
                <input ref={searchRef} value={q} onChange={e=>setQ(e.target.value)} placeholder="Search show / channel / host…  ⌘K" className="w-full bg-white border border-[#e3d6c3] rounded-[15px] px-[14px] py-[12px] text-[14px] outline-none focus:ring-[3px] focus:ring-[#ffe1cf] focus:border-[#f3b593] placeholder-zinc-500 shadow-sm"/>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-zinc-500 bg-[#f7f2ea] border border-[#e9dccc] px-2 py-1 rounded-[8px]">⌘K</span>
              </div>
              <div className="flex flex-wrap gap-[6px]">
                {(["All","Business","Comedy","True Crime","Society","Finance","Horror","Culture"] as CategoryFilter[]).map(c=>(
                  <button key={c} onClick={()=>setCat(c)} className={`px-[12px] py-[8px] rounded-full text-[12.3px] border transition ${cat===c ? "bg-[#191721] text-white border-[#191721]" : "bg-white border-[#e4d8c5] text-zinc-700 hover:border-[#cfbda3]"}`}>{c}</button>
                ))}
              </div>
              <div className="flex gap-[6px] flex-wrap items-center">
                {(["All","YouTube","Spotify","JioSaavn","Apple"] as PlatformFilter[]).map(p=>(
                  <button key={p} onClick={()=>setPlat(p)} className={`px-[11px] py-[7.5px] rounded-[11px] text-[12px] border ${plat===p ? "bg-[#fff1e7] text-[#c84514] border-[#f4c4a8]" : "bg-white border-[#e4d8c5] text-zinc-600"}`}>{p}</button>
                ))}
                <select value={langF} onChange={e=>setLangF(e.target.value as LangFilter)} className="px-[11px] py-[7.5px] rounded-[11px] text-[12px] border bg-white border-[#e4d8c5] text-zinc-700">
                  <option>All</option><option>Hinglish</option><option>English</option><option>Hindi</option>
                </select>
                {(cat!=="All"||plat!=="All"||langF!=="All"||q) && (
                  <button onClick={()=>{setCat("All");setPlat("All");setLangF("All");setQ("");}} className="text-[12px] text-[#c84a1f] underline ml-1">Reset</button>
                )}
              </div>
            </div>

            <div className="mt-4 bg-[#fff9ef] border border-[#f0d8b3] rounded-[15px] px-[14px] py-[10px] text-[13px] text-[#7a4a1d] flex flex-wrap items-center gap-x-4 gap-y-1">
              <b>Active → {activeFilterLabel}</b>
              <span>•</span><span>{filtered.length} shows</span>
              <span>•</span><span>{fmtIn(total7d)} 7-day</span>
              <span>•</span><span>{avgCompletion}% completion</span>
              <span>•</span><span>{fmtMins(avgDurSec)} avg</span>
            </div>
          </div>

          {/* KPIs – reactive */}
          <div className="px-5 sm:px-9 lg:px-[46px] pb-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[14px]">
              <div className="bg-white border border-[#e6ddce] rounded-[24px] px-[18px] pt-[16px] pb-[14px]">
                <div className="text-[11px] uppercase tracking-wider text-zinc-500 font-mono-s">Downloads • filtered</div>
                <div className="mt-2 font-display text-[30px] leading-[0.98] tracking-[-0.017em]">{fmtIn(total7d)}</div>
                <div className="text-[12.5px] text-zinc-600 mt-1">7-day • {filtered.length} shows • {avgGrowth}% avg growth</div>
              </div>
              <div className="bg-white border border-[#e6ddce] rounded-[24px] px-[18px] pt-[16px] pb-[14px]">
                <div className="text-[11px] uppercase tracking-wider text-zinc-500 font-mono-s">Unique listeners</div>
                <div className="mt-2 font-display text-[30px] leading-[0.98] tracking-[-0.017em]">{fmtIn(Math.round(total7d*0.358))}</div>
                <div className="text-[12.5px] text-zinc-600 mt-1">~35.8% listener ratio • filtered</div>
              </div>
              <div className="bg-white border border-[#e6ddce] rounded-[24px] px-[18px] pt-[16px] pb-[14px]">
                <div className="text-[11px] uppercase tracking-wider text-zinc-500 font-mono-s">Average duration</div>
                <div className="mt-2 font-display text-[28px] leading-[0.98] tracking-[-0.017em]">{fmtMins(avgDurSec)}</div>
                <div className="text-[12.5px] text-zinc-600 mt-1">completion {avgCompletion}% • filtered set</div>
              </div>
              <div className="bg-white border border-[#f1c6aa] rounded-[24px] px-[18px] pt-[16px] pb-[14px]">
                <div className="text-[11px] uppercase tracking-wider text-zinc-500 font-mono-s">Top episodes in filter</div>
                <div className="mt-2 font-display text-[28px] leading-[0.98] tracking-[-0.017em]">{filtered.length}</div>
                <div className="text-[12.5px] text-zinc-600 mt-1">{fmtIn(total30d)} • 30-day total</div>
              </div>
            </div>
          </div>

          {/* downloads chart – filter reactive */}
          <div className="px-5 sm:px-9 lg:px-[46px] pb-[18px]">
            <div className="grid grid-cols-12 gap-[18px]">
              <div className="col-span-12 xl:col-span-8 bg-white border border-[#e6ddce] rounded-[30px] shadow-[0_1px_2px_rgba(20,15,10,.05)] overflow-hidden">
                <div className="px-[24px] pt-[20px] pb-[12px] flex flex-wrap items-center justify-between gap-3 border-b border-[#f0e6d6]">
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-zinc-500 font-mono-s">Downloads chart • filtered</div>
                    <div className="text-[20px] font-[650] tracking-[-0.012em]">Audience growth — {activeFilterLabel}</div>
                    <div className="text-[11.5px] text-zinc-500">Chart rescales to current filter • {timeRange}</div>
                  </div>
                  <div className="flex items-center gap-[6px] flex-wrap">
                    <div className="flex bg-[#fbf6ee] border border-[#ead8b9] rounded-[12px] p-[3px] text-[12px]">
                      {(["24h","7d","30d","90d"] as TimeRange[]).map(t=>(
                        <button key={t} onClick={()=>setTimeRange(t)} className={`px-[11px] py-[6px] rounded-[9px] ${timeRange===t ? "bg-[#191720] text-white":"text-zinc-700"}`}>{t}</button>
                      ))}
                    </div>
                    {(["views","listeners","watch_hours"] as Metric[]).map(m=>(
                      <button key={m} onClick={()=>setMetric(m)} className={`px-[11px] py-[6px] rounded-full text-[11.8px] border capitalize ${metric===m ? "bg-[#191720] text-white border-[#191720]":"border-[#e4d8c3] bg-white text-zinc-700"}`}>{m.replace("_"," ")}</button>
                    ))}
                  </div>
                </div>
                <div className="px-[8px] sm:px-[18px] pt-[8px]">
                  <div className="h-[306px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{top:14,right:16,left:-8,bottom:0}}>
                        <defs><linearGradient id="dGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="3%" stopColor="#f35a1d" stopOpacity={0.33}/><stop offset="95%" stopColor="#f35a1d" stopOpacity={0}/></linearGradient></defs>
                        <CartesianGrid strokeDasharray="3 4" stroke="#ece1d2" vertical={false}/>
                        <XAxis dataKey="d" tick={{fontSize:11.5, fill:"#83766a"}} tickLine={false} axisLine={{stroke:"#e8ddd0"}}/>
                        <YAxis tick={{fontSize:11.5, fill:"#83766a"}} tickLine={false} axisLine={false} width={60} tickFormatter={v=> timeRange==="24h" ? `${v}` : `${Math.round(v/1000)}k`}/>
                        <Tooltip cursor={{stroke:"#f2c9b1",strokeWidth:1}} content={({active,payload,label})=> active&&payload?.length ? <div className="bg-[#191720] text-white text-[12px] rounded-2xl px-3 py-[10px] shadow-xl"><div className="text-zinc-400 text-[11px]">{label} • {activeFilterLabel}</div><div className="font-[600]">{metric==="views" ? `${fmtPlain((payload[0].value as number)*1000)} downloads` : metric==="listeners" ? `${fmtPlain((payload[0].value as number)*1000)} listeners` : `${fmtPlain((payload[0].value as number)*1000)} watch hrs`}</div></div> : null}/>
                        <Area type="monotone" dataKey={metric} stroke="#e84d19" strokeWidth={2.3} fill="url(#dGrad)" dot={false} activeDot={{r:4,strokeWidth:0,fill:"#e84d19"}}/>
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="px-[22px] pb-[16px] pt-[4px] grid grid-cols-2 sm:grid-cols-4 gap-4 text-[12.6px] border-t border-[#f0e7d8]">
                  <div><div className="text-zinc-500 text-[11px]">Filtered share</div><div className="text-[15.5px] font-[600]">{(filteredShare*100).toFixed(1)}%</div><div className="text-zinc-500">of India</div></div>
                  <div><div className="text-zinc-500 text-[11px]">Top show</div><div className="text-[14px] font-[600] truncate">{filtered[0]?.podcast || "—"}</div><div className="text-zinc-500">{filtered[0] ? fmtIn(filtered[0].views7d) : "—"}</div></div>
                  <div><div className="text-zinc-500 text-[11px]">Avg completion</div><div className="text-[15.5px] font-[600]">{avgCompletion}%</div><div className="text-zinc-500">filtered</div></div>
                  <div><div className="text-zinc-500 text-[11px]">Avg duration</div><div className="text-[15.5px] font-[600]">{fmtMins(avgDurSec)}</div><div className="text-zinc-500">{langF!=="All" ? langF : "mixed"}</div></div>
                </div>
              </div>

              {/* top shows bar */}
              <div className="col-span-12 xl:col-span-4 bg-white border border-[#e6ddce] rounded-[30px] shadow-[0_1px_2px_rgba(20,15,10,.05)] flex flex-col">
                <div className="px-[20px] pt-[18px] pb-[10px] border-b border-[#f0e6d6]">
                  <div className="text-[11px] uppercase tracking-wider text-zinc-500 font-mono-s">Top episodes • filtered</div>
                  <div className="text-[17.5px] font-[650]">7-day views — {activeFilterLabel}</div>
                </div>
                <div className="px-2 pt-2 flex-1">
                  <div className="h-[286px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={topBarData} layout="vertical" margin={{top:4,right:14,left:0,bottom:4}}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={116} tick={{fontSize:11, fill:"#5c5347"}} axisLine={false} tickLine={false}/>
                        <Tooltip cursor={{fill:"#fff6ec"}} content={({active,payload})=> active&&payload?.length ? <div className="bg-[#1a1822] text-white text-[12px] rounded-xl px-3 py-2 shadow-lg">{payload[0].payload.name}<br/><b>{payload[0].value}M views</b></div> : null}/>
                        <Bar dataKey="views" radius={[0,7,7,0]} barSize={15}>
                          {topBarData.map((entry,i)=> <Cell key={i} fill={filtered[i]?.accent || "#f05a22"} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="px-[18px] pb-[14px] text-[11.5px] text-zinc-600">Bar updates instantly with Category / Platform / Language.</div>
              </div>
            </div>
          </div>

          {/* geography + platform + duration */}
          <div className="px-5 sm:px-9 lg:px-[46px] pb-[18px]">
            <div className="grid grid-cols-12 gap-[18px]">
              <div className="col-span-12 lg:col-span-5 bg-white border border-[#e6ddce] rounded-[30px]">
                <div className="px-[20px] pt-[18px] pb-[10px]">
                  <div className="text-[11px] uppercase tracking-wider text-zinc-500 font-mono-s">Listener geography • filtered</div>
                  <div className="text-[18px] font-[600]">{cityDist[0]?.city || "—"} leads • {activeFilterLabel}</div>
                </div>
                <div className="px-[18px] pb-[18px] space-y-[11px]">
                  {cityDist.length ? cityDist.map(c=>(
                    <div key={c.city}>
                      <div className="flex items-center justify-between text-[13px]">
                        <span className="font-[500]">{c.city}</span>
                        <span><b>{c.share}%</b> <span className="text-zinc-500 text-[11px]">{fmtPlain(c.listeners)}</span></span>
                      </div>
                      <div className="mt-[5px] h-[5.5px] rounded-full bg-[#f2ebe1]"><div className="h-[5.5px] rounded-full" style={{width:`${Math.min(100,c.share*2.7)}%`, background:c.color}}/></div>
                    </div>
                  )) : <div className="text-zinc-500">No city data for this filter.</div>}
                </div>
              </div>

              <div className="col-span-12 lg:col-span-3 bg-white border border-[#e6ddce] rounded-[30px] px-[18px] pt-[18px] pb-[16px]">
                <div className="text-[11px] uppercase tracking-wider text-zinc-500 font-mono-s">Distribution • filtered</div>
                <div className="text-[17px] font-[600]">Platform mix</div>
                <div className="mt-3 space-y-[8px] text-[13px]">
                  {platformDist.map(p=>(
                    <div key={p.name} className="flex items-center justify-between">
                      <span className="flex items-center gap-2"><span className="w-[9px] h-[9px] rounded-full" style={{background:p.color}}></span>{p.name}</span>
                      <span className="font-[600]">{p.value}%</span>
                    </div>
                  ))}
                  {!platformDist.length && <div className="text-zinc-500">—</div>}
                </div>
                <div className="mt-3 h-[8px] rounded-full overflow-hidden bg-[#f2ebe1] flex">
                  {platformDist.map(p=> <div key={p.name} style={{width:`${p.value}%`, background:p.color}}/>)}
                </div>
              </div>

              <div className="col-span-12 lg:col-span-4 bg-white border border-[#e6ddce] rounded-[30px] px-[20px] pt-[18px] pb-[16px]">
                <div className="text-[11px] uppercase tracking-wider text-zinc-500 font-mono-s">Average duration • filtered</div>
                <div className="flex items-baseline gap-3 mt-1">
                  <div className="text-[28px] font-display tracking-[-0.016em]">{fmtMins(avgDurSec)}</div>
                  <div className="text-[12px] px-[8px] py-[3px] rounded-full bg-[#f4f0e4] text-[#705c37]">{avgCompletion}% finish</div>
                </div>
                <div className="mt-3 text-[12.7px] text-zinc-700">
                  {filtered.length} shows • {langDist.map(l=>`${l.label} ${l.pct}%`).join(" • ") || "—"}
                </div>
                <div className="mt-3 h-[10px] rounded-full overflow-hidden border border-[#f0e2d2] flex bg-[#fbf6ee]">
                  {langDist.map(l=> <div key={l.label} style={{width:`${l.pct}%`, background:l.color}} title={`${l.label} ${l.pct}%`}/>)}
                </div>
              </div>
            </div>
          </div>

          {/* episodes table */}
          <div className="px-5 sm:px-9 lg:px-[46px] pb-[34px]">
            <div className="bg-white border border-[#e6ddce] rounded-[30px] overflow-hidden">
              <div className="px-[22px] pt-[18px] pb-[13px] flex items-center justify-between border-b border-[#f0e6d6]">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-zinc-500 font-mono-s">Top episodes • {activeFilterLabel}</div>
                  <div className="text-[19.5px] font-[650]">Content performance</div>
                </div>
                <div className="text-[12.5px] text-zinc-600">Showing <b>{filtered.length}</b></div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[13.5px] min-w-[1020px]">
                  <thead className="text-[11px] text-zinc-500 uppercase tracking-wider bg-[#fdf8f0]">
                    <tr>
                      <th className="text-left font-[500] pl-[22px] pr-3 py-[12px]">#</th>
                      <th className="text-left font-[500] pr-4 py-[12px]">Podcast / Channel</th>
                      <th className="text-left font-[500] pr-3 py-[12px]">Category</th>
                      <th className="text-right font-[500] px-4 py-[12px]">7-day Views</th>
                      <th className="text-right font-[500] px-4 py-[12px] hidden lg:table-cell">30-day</th>
                      <th className="text-left font-[500] px-3 py-[12px]">Watch</th>
                      <th className="text-right font-[500] pr-[22px] pl-3 py-[12px]">Save</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((t,idx)=>(
                      <tr key={t.rank} className={`border-t border-[#f3ece0] ${idx%2===1?"bg-[#fdf9f3]/70":""} hover:bg-[#fff6ed]/90`}>
                        <td className="pl-[22px] pr-3 py-[15px]"><div className={`w-[34px] h-[34px] rounded-[11px] flex items-center justify-center text-[13px] font-[700] ${t.rank<=3?"bg-[#fff1e6] text-[#d7420f] border border-[#ffd1b9]":"bg-[#f7f1e6] text-zinc-700 border border-[#e8dcc7]"}`}>{t.rank}</div></td>
                        <td className="pr-4 py-[15px] min-w-[320px]">
                          <div className="font-[600] text-[14.8px]">{t.podcast}</div>
                          <div className="text-[12.5px] text-zinc-600">{t.channel} • {t.host}</div>
                          <div className="mt-[5px] text-[11.5px] text-zinc-600">{t.lang} • {t.avgDuration} • {t.completion}% • {t.cityTop}</div>
                        </td>
                        <td className="pr-3 py-[15px]"><span className="text-[11.5px] px-[9px] py-[4px] rounded-full bg-[#fff6ec] border border-[#f5d1b6] text-[#b74a18]">{t.category}</span></td>
                        <td className="text-right px-4 py-[15px]"><div className="text-[16.5px] font-[700]">{fmtIn(t.views7d)}</div><div className="text-[11px] text-zinc-500">{fmtPlain(t.views7d)}</div></td>
                        <td className="text-right px-4 py-[15px] hidden lg:table-cell"><div className="text-[14.5px] font-[600]">{fmtIn(t.views30d)}</div></td>
                        <td className="px-3 py-[15px]">
                          <div className="flex flex-col gap-[6px] min-w-[170px]">
                            <a href={t.youtubeUrl} target="_blank" rel="noreferrer" className="px-3 py-[8px] rounded-[11px] bg-[#f65318] text-white text-[12.5px] font-[600] text-center">Open YouTube →</a>
                            <div className="grid grid-cols-3 gap-[5px] text-[11px]">
                              <a className="text-center px-2 py-[5px] rounded-[9px] border border-[#dbd6cf] bg-white" href={t.spotifyUrl} target="_blank" rel="noreferrer">Spotify</a>
                              <a className="text-center px-2 py-[5px] rounded-[9px] border border-[#dbd6cf] bg-white" href={t.jiosaavnUrl} target="_blank" rel="noreferrer">JioSaavn</a>
                              <a className="text-center px-2 py-[5px] rounded-[9px] border border-[#dbd6cf] bg-white" href={t.appleUrl} target="_blank" rel="noreferrer">Apple</a>
                            </div>
                          </div>
                        </td>
                        <td className="text-right pr-[22px] pl-3 py-[15px]">
                          <button onClick={()=> { if(!user){ setShowAuth(true); setToast("Sign in to follow"); return;} toggleFollow(t.rank); }} className={`text-[11.5px] px-[10px] py-[6px] rounded-full border ${followed.includes(t.rank) ? "bg-[#191721] text-white border-[#191721]" : "bg-white border-[#e1d5c4] text-zinc-700"}`}>{followed.includes(t.rank) ? "Following ✓" : "+ Follow"}</button>
                        </td>
                      </tr>
                    ))}
                    {!filtered.length && <tr><td colSpan={7} className="px-[24px] py-12 text-center text-zinc-500">No podcasts match this filter — try a broader Category / Platform / Language.</td></tr>}
                  </tbody>
                </table>
              </div>
              <div className="px-[22px] py-[14px] border-t border-[#f0e6d6] text-[12.5px] text-zinc-600 flex items-center justify-between">
                <span>Filter-reactive • {activeFilterLabel}</span>
                <button onClick={()=>{ setCat("All"); setPlat("All"); setLangF("All"); setQ(""); }} className="text-[#cc4d18] hover:underline">Reset → All India</button>
              </div>
            </div>

            {/* retention */}
            <div className="mt-[18px] bg-white border border-[#e6ddce] rounded-[30px]">
              <div className="px-[22px] pt-[18px] pb-[10px] border-b border-[#f0e6d6] flex items-center justify-between">
                <div><div className="text-[11px] uppercase tracking-wider text-zinc-500 font-mono-s">Listener retention • filtered</div><div className="text-[18px] font-[600]">Average retention — {activeFilterLabel}</div></div>
                <div className="text-[12px] text-zinc-600">{avgCompletion}% completion • {fmtMins(avgDurSec)}</div>
              </div>
              <div className="px-[10px] sm:px-[18px] py-[8px]">
                <div className="h-[228px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={retentionCurve} margin={{top:12,right:18,left:-8,bottom:0}}>
                      <CartesianGrid strokeDasharray="3 4" stroke="#ece3d7" vertical={false}/>
                      <XAxis dataKey="pct" tick={{fontSize:11.5,fill:"#857a6a"}} tickFormatter={v=>`${v}%`} tickLine={false} axisLine={{stroke:"#e8ddd0"}}/>
                      <YAxis tick={{fontSize:11.5,fill:"#857a6a"}} domain={[15,100]} tickFormatter={v=>`${v}%`} tickLine={false} axisLine={false} width={40}/>
                      <Tooltip content={({active,payload,label})=> active&&payload?.length ? <div className="bg-[#1b1822] text-white text-[12px] rounded-xl px-3 py-2 shadow-xl">{label}% through<br/><b>{payload[0].value}% still listening</b><br/><span className="text-zinc-400">{activeFilterLabel}</span></div> : null}/>
                      <Line type="monotone" dataKey="audience" stroke="#e84a19" strokeWidth={2.4} dot={false}/>
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="pt-8 pb-6 text-center text-[12px] text-zinc-500">
              podstat • India Podcast Analytics • fully filter-reactive • {new Date().toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short'})} IST
            </div>
          </div>
        </div>
      </div>

      {/* DETAIL DRAWER */}
      {selected && (
        <div className="fixed inset-0 z-[70]">
          <div className="absolute inset-0 bg-black/50" onClick={()=>setSelected(null)} />
          <div className="absolute right-0 top-0 h-full w-full sm:w-[800px] max-w-[100vw] bg-[#fcf8f1] shadow-2xl border-l border-[#e7d8c2] overflow-y-auto">
            <div className="p-5 sm:p-7">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-[14px] text-white font-[700] flex items-center justify-center" style={{background:selected.accent}}>{selected.channel.slice(0,2).toUpperCase()}</div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-zinc-500 font-mono-s">India #{selected.rank} • {selected.category} • {selected.lang}</div>
                    <div className="text-[22px] font-[700] tracking-[-0.015em]">{selected.podcast}</div>
                    <div className="text-[13px] text-zinc-600">{selected.channel} • {selected.host}</div>
                  </div>
                </div>
                <button onClick={()=>setSelected(null)} className="text-[13px] px-3 py-[7px] rounded-[12px] bg-white border border-[#e3d5c0]">✕</button>
              </div>
              <div className="mt-4 grid sm:grid-cols-4 gap-[8px] text-[13px]">
                <a href={selected.youtubeUrl} target="_blank" rel="noreferrer" className="text-center px-4 py-[11px] rounded-[14px] bg-[#f65318] text-white font-[620]">Open YouTube →</a>
                <a href={selected.spotifyUrl} target="_blank" rel="noreferrer" className="text-center px-4 py-[11px] rounded-[14px] bg-[#191720] text-white">Spotify</a>
                <a href={selected.jiosaavnUrl} target="_blank" rel="noreferrer" className="text-center px-4 py-[11px] rounded-[14px] bg-white border border-[#e1cfb8]">JioSaavn</a>
                <a href={selected.appleUrl} target="_blank" rel="noreferrer" className="text-center px-4 py-[11px] rounded-[14px] bg-white border border-[#e1cfb8]">Apple</a>
              </div>
              <div className="mt-4 text-[13px] text-zinc-700 bg-white border border-[#e7d9c3] rounded-[16px] px-4 py-3">
                <b>{selected.latestEp.title}</b><br/>
                <span className="text-zinc-500">{selected.latestEp.date} • {selected.avgDuration} • {selected.completion}% finish • {selected.cityTop}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* COMPARE */}
      {showCompare && (
        <div className="fixed inset-0 z-[75]">
          <div className="absolute inset-0 bg-black/50" onClick={()=>setShowCompare(false)} />
          <div className="absolute left-1/2 top-[5%] -translate-x-1/2 w-[min(960px,94vw)] bg-[#fcf8f1] border border-[#e5d4ba] rounded-[28px] shadow-2xl overflow-hidden">
            <div className="px-6 pt-5 pb-4 border-b border-[#f0e2c9] flex items-center justify-between">
              <div><div className="text-[11px] uppercase tracking-wider text-zinc-500 font-mono-s">Channel compare</div><div className="text-[20px] font-[700]">Side-by-side</div></div>
              <button onClick={()=>setShowCompare(false)} className="text-[13px] px-3 py-[7px] rounded-[12px] bg-white border border-[#e3d5c0]">Close</button>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <select value={compareA?.rank ?? ""} onChange={e=>setCompareA(allShows.find(s=>s.rank===Number(e.target.value))||null)} className="w-full px-3 py-[10px] rounded-[13px] border border-[#e1d0b5] bg-white text-[13.5px]">
                  <option value="">Pick A…</option>{allShows.map(s=><option key={s.rank} value={s.rank}>#{s.rank} {s.podcast}</option>)}
                </select>
                <select value={compareB?.rank ?? ""} onChange={e=>setCompareB(allShows.find(s=>s.rank===Number(e.target.value))||null)} className="w-full px-3 py-[10px] rounded-[13px] border border-[#e1d0b5] bg-white text-[13.5px]">
                  <option value="">Pick B…</option>{allShows.map(s=><option key={s.rank} value={s.rank}>#{s.rank} {s.podcast}</option>)}
                </select>
              </div>
              {compareA && compareB ? (
                <div className="grid md:grid-cols-2 gap-5 text-[13.5px]">
                  {[compareA,compareB].map(c=>(
                    <div key={c.rank} className="bg-white border border-[#e7d7be] rounded-[18px] p-4">
                      <div className="text-[17px] font-[650]">{c.podcast}</div>
                      <div className="text-zinc-600 text-[12.5px]">{c.channel}</div>
                      <div className="mt-3 grid grid-cols-2 gap-3">
                        <div><div className="text-[11px] text-zinc-500">7-day</div><div className="text-[16px] font-[700]">{fmtIn(c.views7d)}</div></div>
                        <div><div className="text-[11px] text-zinc-500">30-day</div><div className="text-[16px] font-[700]">{fmtIn(c.views30d)}</div></div>
                        <div><div className="text-[11px] text-zinc-500">Completion</div><div className="text-[15px] font-[600]">{c.completion}%</div></div>
                        <div><div className="text-[11px] text-zinc-500">Avg watch</div><div className="text-[15px] font-[600]">{c.avgDuration}</div></div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2 text-[12px]">
                        <a href={c.youtubeUrl} target="_blank" rel="noreferrer" className="px-3 py-[6px] rounded-full bg-[#f65318] text-white">YouTube →</a>
                        <a href={c.spotifyUrl} target="_blank" rel="noreferrer" className="px-3 py-[6px] rounded-full border border-[#e1cfb8] bg-white">Spotify</a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : <div className="text-zinc-600">Choose two channels.</div>}
            </div>
          </div>
        </div>
      )}

      {/* ===== AUTH MODAL – GOOGLE + APPLE prominent ===== */}
      {showAuth && (
        <div className="fixed inset-0 z-[90]">
          <div className="absolute inset-0 bg-black/55 backdrop-blur-[1.5px]" onClick={()=>{setShowAuth(false); setAuthStep("choose");}}/>
          <div className="absolute left-1/2 top-[4%] -translate-x-1/2 w-[min(520px,94vw)] bg-[#fdf9f2] border border-[#e5d4ba] rounded-[28px] shadow-[0_20px_80px_rgba(32,20,8,0.28)] overflow-hidden">
            {/* header brand */}
            <div className="px-7 pt-7 pb-5 bg-gradient-to-b from-[#fffaf2] to-[#fdf6ea] border-b border-[#f0e1c8] flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-[14px] bg-gradient-to-br from-[#ff6b2b] to-[#d63e07] flex items-center justify-center shadow text-white font-[700] text-[15px]">pd</div>
                <div>
                  <div className="font-display text-[20px] tracking-[-0.014em] text-[#1a1612]">podstat</div>
                  <div className="text-[11.5px] text-zinc-600 -mt-[2px]">India Podcast Analytics</div>
                </div>
              </div>
              <button onClick={()=>{setShowAuth(false); setAuthStep("choose");}} className="text-[12.5px] px-[11px] py-[6px] rounded-[11px] bg-white border border-[#e3d5c0] text-zinc-700 hover:bg-[#faf5eb]">✕</button>
            </div>

            <div className="px-7 py-6">
              {authStep==="choose" && (
                <>
                  <div className="text-[22px] font-[700] tracking-[-0.015em] text-[#1b1820]">Sign in to podstat</div>
                  <div className="text-[13.5px] text-zinc-600 mt-1">Continue with Google or Continue with Apple — free.</div>

                  {/* GOOGLE */}
                  <button
                    onClick={()=>{
                      const p = { name:"Arielle Ngo", email:"arielle.ngo@gmail.com", provider:"google" as const, avatar:"https://i.pravatar.cc/120?img=32" };
                      setUser(p); setShowAuth(false); setToast("Signed in with Google • Pro unlocked");
                    }}
                    className="mt-5 w-full flex items-center justify-center gap-3 py-[13px] rounded-[14px] border border-[#d7cfc3] bg-white hover:bg-[#faf7f2] shadow-sm transition"
                  >
                    {/* Google G */}
                    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden>
                      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.1 29.3 35 24 35c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 5.2 29.3 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20.5-7.6 20.5-21 0-1.4-.1-2.7-.4-3.5z"/>
                      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16.1 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 5.2 29.3 3 24 3 16.3 3 9.6 7.2 6.3 14.7z"/>
                      <path fill="#4CAF50" d="M24 45c5.2 0 10-2 13.5-5.2l-6.2-5.3C29.3 35.9 26.8 37 24 37c-5.2 0-9.6-2.9-11.7-7.2l-6.5 5C9.1 41.1 16.1 45 24 45z"/>
                      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.5-6 7-11.3 7-6.6 0-12-5.4-12-12"/>
                    </svg>
                    <span className="text-[15px] font-[550] text-[#1f1f1f]">Continue with Google</span>
                  </button>

                  {/* APPLE */}
                  <button
                    onClick={()=>{
                      const p = { name:"Arielle Ngo", email:"arielle@icloud.com", provider:"apple" as const, avatar:"https://i.pravatar.cc/120?img=5" };
                      setUser(p); setShowAuth(false); setToast("Signed in with Apple • Pro unlocked");
                    }}
                    className="mt-[11px] w-full flex items-center justify-center gap-3 py-[13px] rounded-[14px] bg-black hover:bg-[#111] text-white shadow-sm transition"
                  >
                    {/* Apple logo */}
                    <svg width="18" height="22" viewBox="0 0 17 20" fill="white" aria-hidden>
                      <path d="M13.57 10.14c-.01-2.18 1.78-3.22 1.86-3.27-1.01-1.48-2.59-1.68-3.15-1.7-1.34-.14-2.62.79-3.3.79-.68 0-1.73-.77-2.85-.75-1.47.02-2.82.86-3.57 2.18-1.53 2.65-.39 6.58 1.1 8.73.73 1.05 1.6 2.23 2.74 2.19 1.1-.04 1.52-.71 2.85-.71 1.33 0 1.71.71 2.87.69 1.19-.02 1.94-1.08 2.66-2.14.84-1.22 1.18-2.41 1.2-2.47-.03-.01-2.31-.89-2.33-3.53zM11.48 3.42c.6-.73 1.01-1.74.9-2.76-.87.04-1.92.58-2.54 1.31-.56.65-1.05 1.69-.82 2.68 1.03.08 1.87-.52 2.46-1.23z"/>
                    </svg>
                    <span className="text-[15px] font-[550]">Continue with Apple</span>
                  </button>

                  <div className="flex items-center gap-3 my-5">
                    <div className="h-px bg-[#e6d7c0] flex-1" />
                    <span className="text-[11.5px] text-zinc-500">or</span>
                    <div className="h-px bg-[#e6d7c0] flex-1" />
                  </div>

                  {/* Email */}
                  <button onClick={()=>setAuthStep("email")} className="w-full flex items-center justify-center gap-2 py-[12px] rounded-[13px] border border-[#e1cfb8] bg-white hover:bg-[#faf6ef] text-[14px] text-zinc-800">
                    <span className="text-[16px]">✉️</span> Continue with email
                  </button>

                  {/* Phone IN */}
                  <button onClick={()=>setAuthStep("phone")} className="mt-[10px] w-full flex items-center justify-center gap-2 py-[12px] rounded-[13px] border border-[#e1cfb8] bg-white hover:bg-[#faf6ef] text-[14px] text-zinc-800">
                    <span className="text-[16px]">📱</span> Continue with phone • India +91
                  </button>

                  <div className="mt-5 text-[11.8px] text-zinc-600 leading-relaxed bg-[#fffbf3] border border-[#f0dcc0] rounded-[14px] px-3 py-[10px]">
                    <b>Free • no credit card.</b> Browse all India trending without login.<br/>
                    <b>Sign in options:</b> Continue with Google • Continue with Apple • Email OTP • Phone +91
                    <br/>By continuing you agree to Podstat Terms & Privacy • IST data residency.
                  </div>

                  <div className="mt-4 flex items-center justify-center gap-5 text-[11.5px] text-zinc-500">
                    <span>🔒 OAuth 2.0</span>
                    <span>🇮🇳 IN servers</span>
                    <span>GDPR • PDPB ready</span>
                  </div>
                </>
              )}

              {authStep==="email" && (
                <>
                  <button onClick={()=>setAuthStep("choose")} className="text-[12.5px] text-zinc-600 hover:text-zinc-900 mb-2">← back</button>
                  <div className="text-[20px] font-[650]">Sign in with email</div>
                  <div className="text-[13px] text-zinc-600 mt-1">We’ll send a 6-digit OTP. No password.</div>
                  <input
                    type="email"
                    value={authEmail}
                    onChange={e=>setAuthEmail(e.target.value)}
                    placeholder="you@company.in"
                    className="mt-4 w-full px-4 py-[12px] rounded-[13px] border border-[#e1cfb8] bg-white text-[14px] outline-none focus:ring-2 focus:ring-[#ffe0c9]"
                    autoFocus
                  />
                  <button
                    onClick={()=>{
                      if(!authEmail.includes("@")){ setToast("Enter a valid email"); return; }
                      setAuthStep("otp");
                      setToast("OTP sent to "+authEmail);
                    }}
                    className="mt-3 w-full py-[12px] rounded-[13px] bg-[#191720] text-white font-[600] text-[14.5px]"
                  >Send OTP →</button>
                  <div className="text-center mt-3 text-[12.5px] text-zinc-600">or <button className="text-[#c94b17] underline" onClick={()=>{ const p={name:"Demo User",email:authEmail||"demo@podstat.in",provider:"email" as const, avatar:"https://i.pravatar.cc/120?img=12"}; setUser(p); setShowAuth(false); setAuthStep("choose"); setToast("Signed in • Email"); }}>use magic link</button></div>
                </>
              )}

              {authStep==="phone" && (
                <>
                  <button onClick={()=>setAuthStep("choose")} className="text-[12.5px] text-zinc-600 hover:text-zinc-900 mb-2">← back</button>
                  <div className="text-[20px] font-[650]">Continue with phone</div>
                  <div className="text-[13px] text-zinc-600 mt-1">India +91 • OTP via SMS / WhatsApp</div>
                  <div className="mt-4 flex gap-2">
                    <div className="px-3 py-[12px] rounded-[13px] border border-[#e1cfb8] bg-[#faf6ef] text-[14px] font-[550]">+91</div>
                    <input
                      inputMode="numeric"
                      value={authPhone}
                      onChange={e=>setAuthPhone(e.target.value.replace(/\D/g,"").slice(0,10))}
                      placeholder="98XXXXXXXX"
                      className="flex-1 px-4 py-[12px] rounded-[13px] border border-[#e1cfb8] bg-white text-[14px] outline-none focus:ring-2 focus:ring-[#ffe0c9]"
                      autoFocus
                    />
                  </div>
                  <button
                    onClick={()=>{
                      if(authPhone.length<10){ setToast("Enter 10-digit India mobile"); return; }
                      setAuthStep("otp");
                      setToast("OTP sent to +91 "+authPhone+" • also on WhatsApp");
                    }}
                    className="mt-3 w-full py-[12px] rounded-[13px] bg-[#191720] text-white font-[600] text-[14.5px]"
                  >Send OTP →</button>
                  <div className="text-[11.5px] text-zinc-500 mt-2 text-center">Jio • Airtel • Vi • BSNL supported • WhatsApp fallback ON</div>
                </>
              )}

              {authStep==="otp" && (
                <>
                  <button onClick={()=>setAuthStep(authEmail ? "email" : "phone")} className="text-[12.5px] text-zinc-600 hover:text-zinc-900 mb-2">← back</button>
                  <div className="text-[20px] font-[650]">Enter OTP</div>
                  <div className="text-[13px] text-zinc-600 mt-1">
                    Sent to <b>{authEmail || ("+91 "+authPhone)}</b> • expires in 04:52
                  </div>
                  <input
                    inputMode="numeric"
                    value={otpValue}
                    onChange={e=>setOtpValue(e.target.value.replace(/\D/g,"").slice(0,6))}
                    placeholder="• • • • • •"
                    className="mt-4 w-full text-center tracking-[0.45em] text-[22px] font-mono-s px-4 py-[13px] rounded-[14px] border border-[#e1cfb8] bg-white outline-none focus:ring-2 focus:ring-[#ffe0c9]"
                    autoFocus
                  />
                  <button
                    onClick={()=>{
                      if(otpValue.length < 4){ setToast("Enter the 6-digit OTP"); return;}
                      if(authEmail){
                        setUser({ name: authEmail.split("@")[0], email: authEmail, provider:"email", avatar:"https://i.pravatar.cc/120?img=12"});
                      } else {
                        setUser({ name:"IN User", email:"+91"+authPhone+"@podstat.in", provider:"phone", avatar:"https://i.pravatar.cc/120?img=15"});
                      }
                      setShowAuth(false); setAuthStep("choose"); setOtpValue("");
                      setToast("Verified • Pro unlocked");
                    }}
                    className="mt-3 w-full py-[12px] rounded-[13px] bg-[#f65318] text-white font-[650] text-[15px] shadow-[0_6px_20px_rgba(246,83,24,0.28)]"
                  >Verify & sign in</button>
                  <div className="flex items-center justify-between mt-3 text-[12.5px]">
                    <button className="text-zinc-600 hover:text-zinc-900" onClick={()=>setToast("OTP resent")}>Resend OTP</button>
                    <button className="text-[#c94b17] hover:underline" onClick={()=>setToast("Calling you now…")}>Get a call instead</button>
                  </div>
                </>
              )}
            </div>

            <div className="px-7 pb-6 text-[11.5px] text-zinc-500 border-t border-[#f0e2c8] pt-4">
              Secure sign-in • OAuth 2.0 • Supabase Auth • India (ap-south-1) data residency • No spam • <a href="#" onClick={e=>{e.preventDefault(); setShowAuth(false);}} className="underline decoration-dotted text-zinc-600">Continue without login</a>
            </div>
          </div>
        </div>
      )}

      {/* LIVE UPDATE modal – unchanged from prior */}
      {showLive && (
        <div className="fixed inset-0 z-[78]">
          <div className="absolute inset-0 bg-black/50" onClick={()=>setShowLive(false)} />
          <div className="absolute left-1/2 top-[4%] -translate-x-1/2 w-[min(900px,95vw)] max-h-[90vh] overflow-auto bg-[#fcf8f1] border border-[#e5d4ba] rounded-[28px] shadow-2xl">
            <div className="px-6 pt-5 pb-4 border-b border-[#f0e2c9] flex items-center justify-between sticky top-0 bg-[#fcf8f1]">
              <div><div className="text-[11px] uppercase tracking-wider text-zinc-500 font-mono-s">podstat • Live Engine</div><div className="text-[22px] font-[700] tracking-[-0.015em]">Daily auto-update — India trends</div></div>
              <button onClick={()=>setShowLive(false)} className="text-[13px] px-3 py-[7px] rounded-[12px] bg-white border border-[#e3d5c0]">Close</button>
            </div>
            <div className="p-6 space-y-4 text-[14px] leading-relaxed">
              <div className="bg-white border border-[#e6d7be] rounded-[18px] p-4">
                <div className="text-[15px] font-[650]">Yes — fully automatic, daily, India time.</div>
                <div className="text-zinc-700 mt-2">Server-side pipeline runs at <b>06:30 IST</b> daily, plus a 3-hour spike watch 09:00–23:00 IST. Every filter (Category / Platform / Language) recomputes — charts, KPIs, geo, episodes.</div>
              </div>
              <div className="grid md:grid-cols-3 gap-3 text-[13px]">
                {[
                  ["06:30 IST daily","Full refresh","YouTube Data API v3\nSpotify Charts API\nJioSaavn Trending RSS\nApple Podcasts India Top 200"],
                  ["Every 3h","Spike watch","Detects +15% velocity\nre-ranks Top 22\nalerts via email / WA"],
                  ["Real-time","Client refresh","SWR 6 min\nManual refresh Pro\nWebSocket surges"],
                ].map(([t,s,b])=>(
                  <div key={t} className="bg-white border border-[#e6d7be] rounded-[16px] p-[14px]">
                    <div className="font-[620]">{t}</div>
                    <div className="text-[12.5px] text-[#b64a1c]">{s}</div>
                    <div className="text-[12.5px] text-zinc-700 mt-2 whitespace-pre-line">{b}</div>
                  </div>
                ))}
              </div>
              <div className="bg-[#fdf6ea] border border-[#f0d8b4] rounded-[14px] px-4 py-[12px] text-[12.7px] text-zinc-700">
                Last run: <b>today 06:31 IST</b> • 22 shows in 47s • next: <b>tomorrow 06:30 IST</b><br/>
                Login <b>not required</b> to view daily trends. Sign-in unlocks: follow alerts, queue sync, notes cloud, export API.<br/>
                API: <code className="font-mono-s text-[11.5px]">GET /api/trending?country=IN&category=business&lang=hinglish</code>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-[95] bg-[#18151e] text-white text-[13px] px-4 py-[11px] rounded-[14px] shadow-2xl border border-zinc-700 max-w-[360px]">{toast}</div>
      )}
    </div>
  );
}
// Zod Schema
export const Schema = {
    "commentary": "Podstat – India podcast analytics dashboard with filter-reactive charts (downloads, geography, duration, top episodes). Added full sign-in: Continue with Google, Continue with Apple, Email OTP, Phone OTP (+91 India). Live daily auto-update at 06:30 IST. All charts update instantly when Category / Platform / Language filters change.",
    "template": "nextjs-developer",
    "title": "Podstat \u2013 India Podcast Analytics",
    "description": "Podstat: trending podcasts in India with filter-reactive analytics, watch links (YouTube, Spotify, JioSaavn, Apple), and full authentication (Google, Apple, Email, Phone).",
    "additional_dependencies": [
        "recharts"
    ],
    "has_additional_dependencies": true,
    "install_dependencies_command": "npm install recharts",
    "port": 5173,
    "file_path": "src/App.tsx",
    "code": "<see code above>"
}
