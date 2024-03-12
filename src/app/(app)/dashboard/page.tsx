import { CreateMarkerForm } from "~/app/_components/markers/create-marker-form"
import { DatePickerFilter } from "~/app/_components/markers/date-picker-filter"
import Markerlist from "~/app/_components/markers/markers-list"
import SelectFilter from "~/app/_components/markers/select-filter";


export default async function Dashboard() {

    return (
        <main className="flex container min-h-screen flex-col bg-background text-white">
            <div className="container">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <div className="gap-y-4 sm:flex sm:space-x-4 my-1">
                    <div className="grid gap-y-4 sm:flex sm:flex-1 sm:space-x-4">
                        <CreateMarkerForm />
                    </div>
                    <div className="flex justify-center items-center space-x-4 mt-4 sm:m-0">
                        <DatePickerFilter />
                        <SelectFilter />
                    </div>
                </div>
                <Markerlist/>
            </div>
        </main>
    )
}

export const dynamic = 'force-dynamic';