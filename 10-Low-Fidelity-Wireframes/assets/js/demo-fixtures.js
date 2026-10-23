import {initialState} from './mock-data.js';

const copy = value => structuredClone(value);
const fresh = (id, label, description) => {
  const state=initialState();
  state.demoFixture={id,label,description,prepared:true};
  return state;
};

function preparedOrder(state, id='PV-DEMO-STORE-001') {
  state.order={...state.order,id,items:[{productId:'PRD-1',qty:1}],addressId:'ADDR-1',patientId:'PAT-1',status:'Confirmed',review:'Not required',payment:'Not started',method:'cod',stock:'Active',site:'Demo Store 01',revision:1,total:80,history:['Prepared fictional COD order; no cash collected.'],pack:'Not started',delivery:'Accepted',riderId:'RID-1',codCollected:0,refund:'Not requested',returnStatus:'Not requested',note:'',hold:'Active',customerAccepted:true,customerSubmitted:true,quoteAccepted:true,codEligible:true,packageRef:'',inventoryCommitted:false};
  state.riders[0].status='Assigned';
  state.duty='On duty';
  return state;
}

export const fixtureInfo={
  signup:{label:'New customer',description:'A fresh fictional account and an empty order. No prior login or checkout is complete.'},
  order:{label:'Customer shopping',description:'A fresh fictional shopping session. The cart is empty and no order, payment or stock hold is complete.'},
  prescription:{label:'Prescription order',description:'A fresh fictional order. Add a prescription item and submit details for pharmacist review; no approval is preloaded.'},
  payment:{label:'Payment walkthrough',description:'A fresh fictional checkout. Payment can start only after the customer completes each current gate.'},
  prepare:{label:'Store fulfillment',description:'An accepted demo cash-on-delivery order is ready for store picking. No cash is collected and stock is not yet committed.'},
  deliver:{label:'Rider delivery',description:'A prepared fictional parcel is ready for Dispatch. Its stock movement is labelled historical demo data; delivery is not complete.'},
  return:{label:'Return request',description:'A delivered fictional order is provided as prepared history. No return or refund is already approved.'},
  refund:{label:'Refund review',description:'A fictional paid order has a pending refund request. This prepared history does not create a new payment or payout.'},
  receiving:{label:'Warehouse receiving',description:'A fresh warehouse demo is ready to record actual accepted quantity and any discrepancy.'}
};

export function fixtureFor(id) {
  const info=fixtureInfo[id]||fixtureInfo.order;
  const state=fresh(id,info.label,info.description);
  const o=state.order;
  state.cart=[];
  state.order={...o,id:'PV-DEMO-NEW-001',items:[],status:'Draft',review:'Not required',payment:'Not started',method:'online',stock:'Not held',revision:0,total:0,history:['A new fictional demo order is ready.'],pack:'Not started',delivery:'Unassigned',riderId:null,codCollected:0,refund:'Not requested',returnStatus:'Not requested',note:'',hold:'Not held',customerAccepted:false,customerSubmitted:false,quoteAccepted:false,codEligible:false,inventoryCommitted:false,pickLines:[],packageRef:'',refundReference:''};
  state.rx={uploaded:false,patientId:'',status:'Not provided',fileName:''};

  if(id==='prepare') preparedOrder(state);
  if(id==='deliver') {
    preparedOrder(state,'PV-DEMO-DELIVERY-001');
    const lot=state.inventory.find(item=>item.id==='LOT-1');
    lot.qty-=1;
    state.products.find(item=>item.id==='PRD-1').stock=lot.qty;
    state.inventoryMovements=[{id:'PREPARED-DEMO-PACK-001',batch:lot.batch,qty:-1,reason:'Historical movement in the clearly labelled prepared delivery fixture'}];
    Object.assign(state.order,{status:'Packed',pack:'Packed',stock:'Committed',hold:'Committed',inventoryCommitted:true,delivery:'Unassigned',riderId:null,packageRef:'PKG-PREPARED-001',pickLines:[{productId:'PRD-1',inventoryId:'LOT-1',batch:lot.batch,qty:1}]});
    state.riders[0].status='Available';state.duty='Off duty';
  }
  if(id==='return') {
    Object.assign(state.order,{id:'PV-DEMO-RETURN-001',items:[{productId:'PRD-1',qty:1}],status:'Delivered',review:'Not required',payment:'Paid',method:'online',stock:'Committed',site:'Demo Store 01',revision:2,total:80,history:['Prepared historical demo order; delivered before this walkthrough.'],pack:'Handed over',delivery:'Delivered',riderId:'RID-1',codCollected:0,refund:'Not requested',returnStatus:'Not requested',note:'',hold:'Committed',customerAccepted:true,customerSubmitted:true,quoteAccepted:true,codEligible:false,inventoryCommitted:true,packageRef:'PKG-HISTORY-001'});
  }
  if(id==='refund') {
    Object.assign(state.order,{id:'PV-DEMO-REFUND-001',items:[{productId:'PRD-1',qty:1}],status:'Cancelled',review:'Not required',payment:'Paid',method:'online',stock:'Released',site:'Demo Store 01',revision:2,total:80,history:['Prepared historical demo order; payment was previously recorded.','Finance refund instruction is pending review.'],pack:'Not started',delivery:'Unassigned',riderId:null,codCollected:0,refund:'Pending',returnStatus:'Not requested',note:'',hold:'Released',customerAccepted:true,customerSubmitted:true,quoteAccepted:true,codEligible:false,inventoryCommitted:false,refundReference:'RF-PREPARED-001'});
    state.staffUi={staffSearch:'',orderSearch:'',orderFilter:'All',auditSearch:'',locationSearch:'',ledger:[],importRows:[],importKind:'catalog',importId:'',importApplied:[],refunds:[{id:'RF-PREPARED-001',amount:40,reason:'Prepared fictional refund request',destination:'Original payment method',status:'Pending'}],refundAmount:'40',refundReason:'Prepared fictional refund request',refundDestination:'Original payment method',refundVerified:false,invoice:'',invoiceStatus:'Pending tax approval',creditReason:'',creditAmount:0,reportFrom:'2026-10-01',reportTo:'2026-10-23',reportSite:'Current location',catalogDraft:null,settingsDraft:null,locations:[],cases:[],alertRead:false,adjustment:null};
  }
  return state;
}
