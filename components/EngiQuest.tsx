'use client';
import {useState} from 'react';
import dynamic from 'next/dynamic';
import {Compass,FlaskConical,Box,Orbit,ChartNoAxesCombined,Sun,Moon,UserRound,ArrowUpRight,type LucideIcon} from 'lucide-react';
import {MotionConfig} from 'framer-motion';
import {FIELDS,fieldName,type FieldFilter,type Field} from '@/lib/fields';
import {LABS} from '@/lib/labs';
import {projects} from '@/lib/projects';
import {getDisciplineTheme} from '@/lib/discipline-themes';
import {ProgressProvider,useProgress} from '@/lib/state';
import {CAD_QUESTS} from './cad/cad-model';
import {Welcome,TrackSelection,FieldDashboard,StudioMasthead} from './Worlds';
import Quiz from './Quiz';
import Overlay from './Overlay';
import LabRunner from './LabRunner';
import ProjectRunner from './ProjectRunner';
import Careers from './Careers';
import Journey from './Journey';
import EngiBot from './EngiBot';
const CadWorkspace=dynamic(()=>import('./cad/CadWorkspace'),{ssr:false,loading:()=> <div className="panel">Opening your 3D workspace…</div>});
type Tab='Labs'|'Quest DStudios'|'EngiScope'|'My Journey';
type View=Tab|'Welcome'|'Tracks';
const NAV:{icon:LucideIcon;title:Tab;subtitle:string}[]=[{icon:FlaskConical,title:'Labs',subtitle:'Experiment & build'},{icon:Box,title:'Quest DStudios',subtitle:'Create in three dimensions'},{icon:Orbit,title:'EngiScope',subtitle:'Meet your possible future'},{icon:ChartNoAxesCombined,title:'My Journey',subtitle:'See how far you have come'}];
function App(){
 const {data,hydrated,storageError,update,complete}=useProgress();
 // Opening the welcome view never writes to saved progress. Hydration runs first.
 const [view,setView]=useState<View>('Welcome');
 const [catalog,setCatalog]=useState<'labs'|'projects'>('labs');
 const [active,setActive]=useState<string|null>(null);
 const [modal,setModal]=useState<'quiz'|'retake'|'profile'|null>(null);
 const [cadQuestId,setCadQuestId]=useState(CAD_QUESTS[0].id);
 const [cadStartQuest,setCadStartQuest]=useState<string|undefined>();
 function navigate(next:View){setView(next);setActive(null);window.scrollTo({top:0});}
 function chooseField(field:FieldFilter){update(s=>({...s,field}));setActive(null);setCadStartQuest(undefined);}
 function enterField(field:FieldFilter){chooseField(field);navigate('Labs');}
 function openCad(questId?:string){setCadStartQuest(questId);if(questId)setCadQuestId(questId);navigate('Quest DStudios');}
 if(!hydrated)return <main className="loading"><Compass size={48}/><p>Loading your local journey…</p></main>;
 const theme=getDisciplineTheme(data.field);
 const landing=view==='Welcome'||view==='Tracks';
 const lab=catalog==='labs'?LABS.find(l=>l.id===active):undefined;
 const project=catalog==='projects'?projects.find(p=>p.id===active):undefined;
 const cadQuest=CAD_QUESTS.find(q=>q.id===cadQuestId&&(data.field==='all'||q.field===data.field))??CAD_QUESTS.find(q=>data.field==='all'||q.field===data.field);
 const brand=<button className="brand" onClick={()=>navigate('Welcome')} aria-label="EngiQuest home"><img src="/engiquest-logo.png" alt=""/><span>Engi<span className="orange">Quest</span><small>IDEAS START HERE</small></span></button>;
 const settings=<div className="top-actions"><label className="field-selector"><Compass size={16}/><span className="sr-only">Engineering field</span><select aria-label="Engineering field" value={data.field} onChange={e=>chooseField(e.target.value as FieldFilter)}><option value="all">All Disciplines</option>{FIELDS.map(f=><option key={f.id} value={f.id}>{f.name}</option>)}</select></label><button className="profile-button" aria-label={`Switch to ${data.theme==='dark'?'light':'dark'} mode`} onClick={()=>update(s=>({...s,theme:s.theme==='dark'?'light':'dark'}))}>{data.theme==='dark'?<Sun size={18}/>:<Moon size={18}/>}</button><button className="profile-button" aria-label="Profile" onClick={()=>setModal('profile')}><UserRound size={19}/></button></div>;
 return <MotionConfig reducedMotion="user"><a className="skip-link" href="#main-content">Skip to main content</a><div className={`app-shell world-${data.field} ${landing?'landing-shell':''}`}>
 {landing?<header className="welcome-topbar">{brand}{settings}</header>:<aside className="sidebar">{brand}<div className="nav-label">YOUR EXPLORATION SPACE</div><nav aria-label="Main navigation">{NAV.map(({icon:Icon,title,subtitle})=><button key={title} className={view===title?'nav active':'nav'} onClick={()=>title==='Quest DStudios'?openCad():navigate(title)} aria-current={view===title?'page':undefined}><Icon size={20}/><span>{title}<small>{subtitle}</small></span>{view===title&&<span className="nav-indicator"/>}</button>)}</nav><div className="rail-world"><span className="eyebrow">CURRENT WORLD / {theme.code.split('/')[1]}</span><b>{theme.studioName}</b><p>{theme.tagline}</p><button className="text-button" onClick={()=>navigate('Tracks')}>Explore another world <ArrowUpRight size={15}/></button></div><div className="side-bottom"><span className="tiny">FOR THE NEXT GENERATION<br/>OF PROBLEM SOLVERS.</span><span className="rail-grade">GRADES 6–12</span></div></aside>}
 <div className="main-shell">{!landing&&<header className="topbar"><span className="breadcrumb">{theme.code} <span>/</span> <b>{view}</b></span>{settings}</header>}
 <main id="main-content" tabIndex={-1}>{storageError&&<p role="alert" className="notice">{storageError}</p>}
 {view==='Welcome'&&<Welcome onQuiz={()=>setModal('quiz')} onTracks={()=>navigate('Tracks')} onCad={()=>openCad()} quizCount={data.quiz.length}/>}
 {view==='Tracks'&&<TrackSelection onChoose={enterField}/>}
 {view==='Labs'&&(active?(lab?<LabRunner key={lab.id} lab={lab} onBack={()=>setActive(null)}/>:project?<ProjectRunner key={project.id} project={project} onBack={()=>setActive(null)}/>:null):<FieldDashboard key={data.field} catalog={catalog} onCatalog={setCatalog} onOpen={id=>{setActive(id);window.scrollTo({top:0});}} onCad={openCad}/>)}
 {view==='Quest DStudios'&&<><StudioMasthead label="QUEST DSTUDIOS" title="Imagine it. Give it shape." text="A blank grid is just the beginning. Build, combine, subtract, and make an idea your own."/><CadWorkspace key={cadStartQuest??'free'} initialQuestId={cadStartQuest} field={data.field} onQuestChange={setCadQuestId} onComplete={(id,score)=>{const q=CAD_QUESTS.find(q=>q.id===id);if(q)complete({id,score,kind:'cad',field:q.field as Field,title:q.title});}}/></>}
 {view==='EngiScope'&&<><StudioMasthead label="ENGISCOPE" title={data.field==='all'?'A world of possible futures.':`${fieldName(data.field)} in the real world.`} text={theme.tagline}/><Careers field={data.field}/></>}
 {view==='My Journey'&&<><StudioMasthead label="YOUR EXPLORER LOG" title="Every experiment moves you forward." text={`${data.nickname}, your ideas are taking shape. Your saved progress across all six disciplines is collected here.`}/><Journey/></>}
 <footer><span>EngiQuest / A place for curious minds.</span><span>Explore. Experiment. Engineer.</span></footer></main></div></div>
 <EngiBot field={data.field} activityKind={view==='Quest DStudios'?'cad':lab?'lab':project?'project':undefined} activityId={view==='Quest DStudios' ?cadQuest?.id:lab?.id??project?.id}/>
 {(modal==='quiz'||modal==='retake')&&<Quiz retake={modal==='retake'} onChooseField={enterField} onClose={()=>setModal(null)}/>}
 {modal==='profile'&&<Overlay title="Your explorer profile" drawer onClose={()=>setModal(null)}><label className="control"><span>Nickname</span><input maxLength={24} value={data.nickname} onChange={e=>update(s=>({...s,nickname:e.target.value}))}/></label><p className="muted">Use a nickname, not your full name.</p><label className="control"><span>Active field</span><select value={data.field} onChange={e=>chooseField(e.target.value as FieldFilter)}><option value="all">All Disciplines</option>{FIELDS.map(f=><option key={f.id} value={f.id}>{f.name}</option>)}</select></label><label className="control"><span>Theme</span><select value={data.theme} onChange={e=>update(s=>({...s,theme:e.target.value as 'light'|'dark'}))}><option value="dark">Dark</option><option value="light">Light</option></select></label><h3 className="space-top">Discover your path</h3><p className="muted">{data.quiz.length}/20 questions answered. Interests can change, and so can your path.</p><button className="button secondary full" onClick={()=>setModal('retake')}>Retake interest quiz</button><p className="muted small-space">Your profile and progress stay in this browser. See My Journey for an export and storage details.</p></Overlay>}
 </MotionConfig>;
}
export default function EngiQuest(){return <ProgressProvider><App/></ProgressProvider>;}
