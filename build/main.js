"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const members_1 = __importDefault(require("./data/members"));
// helper variables
const membersAnalysed = new Map();
const paymentRegistry = new Map();
function isMemberAnalysed(memberId) {
    return membersAnalysed.get(memberId);
}
function processPayment(memberName, paysTo) {
    const recordedPaysTo = paymentRegistry.get(memberName) || paysTo;
    paymentRegistry.set(memberName, [...new Set([...recordedPaysTo, ...paysTo])]);
}
function processMemberTree(member, paysTo) {
    membersAnalysed.set(member.id, true);
    paysTo.push(member.name);
    // is own parent, assumed this member would pay
    if (member.id === member.linkId) {
        processPayment(member.name, paysTo);
    }
    // is root
    if (member.linkId === null) {
        processPayment(member.name, paysTo);
        return;
    }
    // find parent
    const parent = members_1.default.find(node => node.id === member.linkId);
    // proccess parent, even if it was already analysed, to calculate all the members he needs to pay for
    if (parent.linkId === null || !isMemberAnalysed(parent.id)) {
        processMemberTree(parent, paysTo);
    }
}
for (const member of members_1.default) {
    if (!isMemberAnalysed(member.id)) {
        processMemberTree(member, []);
    }
}
console.log(paymentRegistry);
