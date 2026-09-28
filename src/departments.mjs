// The approved publication map. Upcoming entries lead to their index cards until
// their own landing routes are published; no navigation item leads to a 404.
export const departments = [
  {name:'Home / Current Issue', route:'/', description:'The cover story, editorial picks, and the current issue.'},
  {name:'Fin@Tech', planned:'/fintech', description:'Markets, trading, crypto, and financial technology with sources and dates.'},
  {name:'The Reading Room', planned:'/reading-room', description:'Outside Signals, original essays, and the Daily Desk.', links:[['The Daily Desk','/daily-desk'],['Agentic@Enigmas','/blog'],['Essays','/enigmas']]},
  {name:'Culture', route:'/culture', description:'Fashion, art, screen, and nightlife.'},
  {name:'Travel & Leisure', planned:'/travel', description:'Places, journeys, and life beyond the itinerary.'},
  {name:'Pets', planned:'/pets', description:'An epic reader pet gallery, with submissions reviewed before publication.'},
  {name:'Motor', route:'/motor', description:'Supercars, classics, racing, and the art of motion.'},
  {name:'Food', route:'/food', description:'Taste, craft, chefs, recipes, and food science.'},
  {name:'Forge & Flow', route:'/practice', description:'Movement, meditation, martial arts, and sport.', links:[['FORM','/form']]},
  {name:'Music', route:'/music', description:'Sound, artists, and the Ether Room.', links:[['The Ether Room','/ether']]},
  {name:'Academic Journal', route:'/inquiry', description:'Research papers, policy, methods, and peer commentary.', links:[['Research Journal','/journal']]},
  {name:'Tech@Lounge', route:'/tech-lounge', description:'AI, security, software, devices, and future technology.'},
  {name:'In Development', route:'/development', description:'The Enterprise’s systems and works in progress.'},
  {name:'About the Enterprise', route:'/about', description:'Purpose, standards, projects, and Diana.'},
];
export const departmentHref = (department, index) => department.route || `/departments#department-${index+1}`;
