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
    City,
    Event,
    Resource,
    Road,
    Sign,
    Store,
    Tuple,
    Venue
}