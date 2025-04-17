interface Tour
{
    shows: Show[]
}

interface Show
{
    date: number
    timeTo: number //https://www.travelmath.com/driving-time/ as an number rounded to .1
    city: string
    venue: string
    events?: [number]
}