class BoundedNumber
{
    constructor
    (
        private number: number = 0, 
        public floor: number = 0, 
        public ceiling: number = 1,
        public discrete: boolean = true, //todo
        public overflow: boolean = false, //todo
        public underflow: boolean = false //todo
    )
    {
        this.Process()
    }

    Process()
    {
        let ceiling = this.ceiling
        let floor = this.floor 
        if (this.floor > this.ceiling || this.ceiling < this.floor)
        {
            this.floor = ceiling
            this.ceiling = floor
        } 

        if (this.number <= this.floor) this.number = (this.underflow) ? this.ceiling : this.floor
        if (this.number >= this.ceiling) this.number = (this.overflow) ? this.floor : this.ceiling
    }

    Number() : number
    {
        return this.number
    }
}

class City
{
    "name": string
    "state": string
    "roads": Array<Road>
    "events": Array<Event>
    "venues": Array<Venue>
}

class Road
{
    "cities": Tuple<City, City>
    "distance": number
}

class Venue 
{
    "name": string
    "merch-cut": number
    "occupancy": number
    "events": Array<Event>
}

class Store
{ 
    "name": string
    "resource-choices": Array<Tuple<Choice, Resource>>
    "events": Array<Event>
}


class Tuple<T1, T2>
{
    constructor
    (
        public item1: T1, 
        public item2: T2
    ) 
    {}
}

class Event
{

}

class Choice
{
    "choice-texts": Array<string>
}

class Sign
{
    "stores": Array<Store>
    "miles-added": number
}



enum Resource
{

}

export
{
    BoundedNumber,
    City,
    Event,
    Road,
    Tuple
}