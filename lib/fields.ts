export const FIELDS = [
 {id:'mechanical',name:'Mechanical & Aerospace',short:'Mechanical',color:'#53d3f4',description:'Make motion work. Explore flight, forces, energy, and machines.'},
 {id:'civil',name:'Civil & Structural',short:'Civil',color:'#f2b85f',description:'Shape resilient places. Build bridges, structures, and safer cities.'},
 {id:'electrical',name:'Electrical & Electronics',short:'Electrical',color:'#ad9cff',description:'Follow the signal. Turn circuits and logic into useful systems.'},
 {id:'robotics',name:'Robotics & Software',short:'Robotics',color:'#fa80ab',description:'Give ideas a mind of their own. Code, sense, and control.'},
 {id:'biomedical',name:'Biomedical',short:'Biomedical',color:'#5cddb6',description:'Design for human health. Explore helpful devices and materials.'},
 {id:'green',name:'Green Tech & Environmental',short:'Green Tech',color:'#b0d964',description:'Engineer a lighter footprint. Explore energy, water, and our planet.'},
] as const;
export type Field = typeof FIELDS[number]['id'];
export type FieldFilter = Field|'all';
export const fieldName=(id:string)=>FIELDS.find(f=>f.id===id)?.name ?? 'All Disciplines';
