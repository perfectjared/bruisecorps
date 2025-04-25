//utility

class Tuple<T1, T2>
{
    constructor
    (
        public item1: T1, 
        public item2: T2
    ) 
    {}
}

//https://stackoverflow.com/questions/39494689/is-it-possible-to-restrict-number-to-a-certain-range/70307091#70307091
type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
    ? Acc[number]
    : Enumerate<N, [...Acc, Acc['length']]>
export type BoundedInt<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>

//mechanical
class City
{
    "name": string
    "state": string
    "roads": Array<Road>
    "cyoa": Array<CYOA>
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
    "cyoa": Array<CYOA>
}

class Store
{ 
    "name": string
    "resource-choices": Array<Tuple<Choice, Resource>>
    "cyoa": Array<CYOA>
}

class CYOA
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

