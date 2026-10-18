import {FIELDS,type Field} from './fields';
export const QUIZ_STAGES=['Interests','Scenarios','Problem-Solving','Impact'];
type Question={text:string;weights:Partial<Record<Field,number>>};
export const QUESTIONS:Question[]=[
 {text:'I like figuring out how moving machines and aircraft work.',weights:{mechanical:2,robotics:1}},
 {text:'I notice how bridges, buildings, and public spaces are designed.',weights:{civil:2,green:1}},
 {text:'I want to understand circuits, lights, and electronic devices.',weights:{electrical:2,robotics:1}},
 {text:'I enjoy coding, puzzles, and giving a robot instructions.',weights:{robotics:2,electrical:1}},
 {text:'I am curious about devices that help people move, breathe, or heal.',weights:{biomedical:2,mechanical:1}},
 {text:'At a school fair, I would choose to improve a solar-powered water system.',weights:{green:2,electrical:1}},
 {text:'After a storm, I would help design a safer bridge and drainage system.',weights:{civil:2,green:1}},
 {text:'For a team challenge, I would build a small flying or rolling machine.',weights:{mechanical:2,robotics:1}},
 {text:'I would enjoy making a sensor that helps a doctor understand a signal.',weights:{biomedical:2,electrical:1}},
 {text:'I would choose to program a robot that sorts recyclable objects.',weights:{robotics:2,green:1}},
 {text:'I like testing shapes and materials to make a structure stronger.',weights:{civil:2,mechanical:1}},
 {text:'I enjoy tracing why a circuit or signal is not behaving as expected.',weights:{electrical:2,biomedical:1}},
 {text:'I would compare ways to clean water while using less energy.',weights:{green:2,biomedical:1}},
 {text:'I like breaking a complicated task into precise steps a computer can follow.',weights:{robotics:2,civil:1}},
 {text:'I enjoy balancing speed, strength, and energy in a mechanical design.',weights:{mechanical:2,civil:1}},
 {text:'I want to make everyday devices easier for people with disabilities to use.',weights:{biomedical:2,robotics:1}},
 {text:'I want to help communities build safer, more accessible places.',weights:{civil:2,biomedical:1}},
 {text:'I would like to improve clean energy and reduce pollution.',weights:{green:2,electrical:1}},
 {text:'I want to create reliable electronics that connect and help people.',weights:{electrical:2,biomedical:1}},
 {text:'I would like to design machines that use fewer resources.',weights:{mechanical:1,green:2}},
];
export function quizMatches(answers:number[]){return FIELDS.map(f=>{let points=0,max=0;QUESTIONS.forEach((q,i)=>{const w=q.weights[f.id]??0;max+=w*4;points+=w*Math.min(4,Math.max(0,Number.isFinite(answers[i])?answers[i]:0))});return {...f,points,max,percent:Math.round(points/max*100)}}).sort((a,b)=>b.percent-a.percent)}
