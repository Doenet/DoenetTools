// This file was generated by lezer-generator. You probably shouldn't edit it.
import {LRParser} from "@lezer/lr"
import {startTag, commentContent, elementContext} from "./tokens.js"
import {NodeProp} from "@lezer/common"
export const parser = LRParser.deserialize({
  version: 13,
  states: ")YOQOTOOO`OYO'#CdOhO`O'#CgO!UOTO'#CfOOOP'#Cf'#CfOOOP'#Cy'#CyOOOP'#Cp'#CpQQOTOOOOOQ'#Cq'#CqO!]OYO,59OOOOP,59O,59OO!eOpO,59RO!sO`O'#CmOOOP'#DU'#DUOOOP'#Cv'#CvO!xOTO,59QO#PO`O'#CnOOOP,59Q,59QOOOP-E6n-E6nOOOQ-E6o-E6oOOOP1G.j1G.jOOOO'#Cr'#CrO#XOpO1G.mO#gOpO'#CiO#xOpO'#CsO$WOpO1G.mOOOP1G.m1G.mOOOP1G.u1G.uO$cOWO,59XOOOP-E6t-E6tOOOP1G.l1G.lO$hO`O,59YO$pOWO,59YOOOO-E6p-E6pO$xOpO7+$XOOOP7+$X7+$XOOOP7+$a7+$aO%TOWO,59TO%]OpO,59_OOOO-E6q-E6qOOOP1G.s1G.sO%kOWO1G.tO%kOWO1G.tOOOP1G.t1G.tOOOP<<Gs<<GsOOOP<<G{<<G{O%sO!bO'#DOO&OO#tO'#DROOOO'#Cl'#ClOOOO1G.o1G.oO&ZOWO7+$`OOOP7+$`7+$`OOOO'#Ct'#CtO&cO!bO,59jOOOO,59j,59jOOOO'#Cu'#CuO&nO#tO,59mOOOO,59m,59mOOOP<<Gz<<GzOOOO-E6r-E6rOOOO1G/U1G/UOOOO-E6s-E6sOOOO1G/X1G/X",
  stateData: "&|~OPQOVTOXTOoPO~OlWOnYO~O[ZO~OPQOQ`OS[OT]OV]OX]OoPO~ORaO~PmOlWOndO~O^gOpjOqeOykO~O[lO~ORnO~PmO[pOqeO~O^gOpsOqeOytO~O_uO^]Xp]Xq]Xy]X~OqeO^gXpgXygX~O^gOpsOytO~OpxO~O[yOqeO~Op{OqeO~O^gOp|Oy}O~Os!OOv!PO~OqeO^gapgayga~Op!TOqeO~OX!UOs!WOt!UO~OX!XOv!ZOw!XO~Op![OqeO~OX!UOs!^Ot!UO~OX!XOv!`Ow!XO~Owt~",
  goto: "$[yPPPPPPPPzPz!SP!YPP!`!O!c!i!o!u!{#c#m#s#yPP$PPPPP$TPP$TPP$WSTOVT]R_XRORV_XhZfirR!RuQaRRn_XSORV_QVORbVQXPRcXQfZQo`Yqfovz!SQvhQzpR!SyQiZQrfTwirQ!V!OR!]!VQ!Y!PR!_!YQ_RRm_TUOVR!QuT^R_",
  nodeNames: "⚠ StartTag StartCloseTag MissingCloseTag StartCloseTag StartCloseTag Document Text Comment Macro Element OpenTag TagName Attribute AttributeName Is AttributeValue MismatchedCloseTag CloseTag SelfClosingTag",
  maxTerm: 41,
  context: elementContext,
  nodeProps: [
    [NodeProp.closedBy, 1,"SelfCloseEndTag EndTag",11,"CloseTag MissingCloseTag"],
    [NodeProp.openedBy, 18,"OpenTag"]
  ],
  skippedNodes: [0],
  repeatNodeCount: 7,
  tokenData: ";`~R|OX#{XZ({Z]*n]^({^p#{pq({qr#{rs,qst#{tu-^uw#{wx/sx}#{}!O0`!O!P#{!P!Q5l!Q![3b![!^#{!^!_7Y!_!`9v!`!a:k!a!c#{!c!}3b!}#R#{#R#S3b#S#T#{#T#o3b#o#y#{#y#z*n#z$f#{$f$g*n$g#BY#{#BY#BZ*n#BZ$IS#{$IS$I_*n$I_$I|#{$I|$JO*n$JO$JT#{$JT$JU*n$JU$KV#{$KV$KW*n$KW&FU#{&FU&FV*n&FV~#{!R$UWVPwpt`Or#{rs$nst#{uw#{wx&dx!^#{!^!_'q!_~#{a$uUVPt`Ot$nuw$nwx%Xx!^$n!^!_%p!_~$nP%^SVPOt%Xu!^%X!^!_%j!_~%XP%mPpq%Xa%uTt`Op&Upq$nqt&Uuw&Ux~&U`&ZRt`Ot&Uuw&Ux~&Uq&kUVPwpOr&drs%Xst&du!^&d!^!_&}!_~&dq'STwpOp'cpq&dqr'cst'cu~'cp'hRwpOr'cst'cu~'c!R'xWwpt`Op(bpq#{qr(brs&Ust(buw(bwx'cx~(b!Q(iUwpt`Or(brs&Ust(buw(bwx'cx~(b_)ShVPq^OX%XX^({^p%Xpq({qt%Xu!^%X!^!_%j!_#y%X#y#z({#z$f%X$f$g({$g#BY%X#BY#BZ({#BZ$IS%X$IS$I_({$I_$I|%X$I|$JO({$JO$JT%X$JT$JU({$JU$KV%X$KV$KW({$KW&FU%X&FU&FV({&FV~%X!a*ylVPq^wpt`OX#{X^*n^p#{pq*nqr#{rs$nst#{uw#{wx&dx!^#{!^!_'q!_#y#{#y#z*n#z$f#{$f$g*n$g#BY#{#BY#BZ*n#BZ$IS#{$IS$I_*n$I_$I|#{$I|$JO*n$JO$JT#{$JT$JU*n$JU$KV#{$KV$KW*n$KW&FU#{&FU&FV*n&FV~#{!T,zUvrVPt`Ot$nuw$nwx%Xx!^$n!^!_%p!_~$n~-eVwpt`tu-zxy.a}!O/_!Q![/_!c!}/_#R#S/_#T#o/_~-}Uxy.a}!O/_!Q![/_!c!}/_#R#S/_#T#o/_~.dT}!O.s!Q![.s!c!}.s#R#S.s#T#o.s~.vUyz/Y}!O.s!Q![.s!c!}.s#R#S.s#T#o.s~/_OX~~/dTX~}!O/_!Q![/_!c!}/_#R#S/_#T#o/_!T/|UsbVPwpOr&drs%Xst&du!^&d!^!_&}!_~&d!a0mb^W[SVPwpt`Or#{rs$nst#{uw#{wx&dx}#{}!O1u!O!Q#{!Q![3b![!^#{!^!_'q!_!c#{!c!}3b!}#R#{#R#S3b#S#T#{#T#o3b#o~#{!a2Sd^W[SVPwpt`Or#{rs$nst#{uw#{wx&dx}#{}!O3b!O!Q#{!Q![3b![!^#{!^!_'q!_!`#{!`!a4w!a!c#{!c!}3b!}#R#{#R#S3b#S#T#{#T#o3b#o~#{!_3ob^W[SVPwpt`Or#{rs$nst#{uw#{wx&dx}#{}!O3b!O!Q#{!Q![3b![!^#{!^!_'q!_!c#{!c!}3b!}#R#{#R#S3b#S#T#{#T#o3b#o~#{!T5SWnQVPwpt`Or#{rs$nst#{uw#{wx&dx!^#{!^!_'q!_~#{!Z5uYVPwpt`Or#{rs$nst#{uw#{wx&dx!^#{!^!_'q!_!`#{!`!a6e!a~#{!Z6pWVPyWwpt`Or#{rs$nst#{uw#{wx&dx!^#{!^!_'q!_~#{!R7aWwpt`Op(bpq#{qr7yrs&Ust(buw(bwx'cx~(b!R8QWwpt`Or(brs&Ust(buw(bwx'cx}(b}!O8j!O~(b!R8qWwpt`Or(brs&Ust(buw(bwx'cx}(b}!O9Z!O~(b!R9dUoPwpt`Or(brs&Ust(buw(bwx'cx~(b!Z:RW_WVPwpt`Or#{rs$nst#{uw#{wx&dx!^#{!^!_'q!_~#{!]:vWVPpYwpt`Or#{rs$nst#{uw#{wx&dx!^#{!^!_'q!_~#{",
  tokenizers: [startTag, commentContent, 0, 1, 2, 3, 4, 5],
  topRules: {"Document":[0,6]},
  tokenPrec: 271
})
