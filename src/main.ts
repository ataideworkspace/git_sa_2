import members from './data/members';
import Member from './models';

// helper variables
const membersAnalysed = new Map<number, boolean>();
const paymentRegistry = new Map<string, string[]>();

function isMemberAnalysed(memberId: number) {
    return membersAnalysed.get(memberId);
}

function processPayment(memberName: string, paysTo: string[]) {
    const recordedPaysTo = paymentRegistry.get(memberName) || paysTo ;
    paymentRegistry.set(memberName, [...new Set([...recordedPaysTo, ...paysTo])]);
}

function processMemberTree(member: Member, paysTo: string[]) {        
    membersAnalysed.set(member.id, true);
    paysTo.push(member.name);

    // is own parent, assumed this member would pay
    if (member.id === member.linkId) {
        processPayment(member.name, paysTo)
    }
        
    // is root
    if (member.linkId === null) {
        processPayment(member.name, paysTo);
        return;
    }
    
    // find parent
    const parent = members.find(node => node.id === member.linkId) as Member;
    // proccess parent, even if it was already analysed, to calculate all the members he needs to pay for
    if(parent.linkId === null || !isMemberAnalysed(parent.id)) {
        processMemberTree(parent, paysTo);
    }    
} 

for (const member of members) {    
    if(!isMemberAnalysed(member.id)){
        processMemberTree(member, [])
    }     
}

console.log(paymentRegistry);




