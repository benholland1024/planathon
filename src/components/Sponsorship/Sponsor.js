export function Contact() {
    return {
        name: '',
        email: '',
        notes: ''
    }
}

export function Interaction() {
    return { 
        occurred: Date(),
        notes: ''
    }
}

export function Sponsor(eventId='', company='', contactName='', contactEmail='') {    
    return {
        hackathonId: eventId,
        company: company,
        contacts: [ Contact() ],
        yearRefs: [],
        interactions: [ ],
        watchers: [ ],
        sponsored: {
            amount: 0,
            dateCommited: '',
            datePaid: ''
        }
    };
}

export async function importSponsors(db, eventId, previousEvent, userId) {
    // TODO: Check access to previous hackathon
    let prevSponsors = await db.collection('sponsors')
        .where('hackathonId', '==', previousEvent)
        .get()
    
    prevSponsors.forEach(async (element) => {
        let spons = element.data()
        console.log('spon ', spons)
        let newSpons = this.createSponsor(
            eventId,
            spons.company,
        );
        
        // Copy contact data.
        newSpons.contacts = spons.contacts;

        // All the previous references.
        newSpons.yearRefs = spons.yearRefs;
        // Add the previous event ref.
        newSpons.yearRefs.push(element.id);

        newSpons.watchers.push(userId);

        console.log('new: ', newSpons)
        let result = await db.collection('sponsors')
            .add(newSpons);
        console.log("Added new sponsor: ", result)
    });
}