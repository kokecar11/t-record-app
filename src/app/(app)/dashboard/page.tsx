import { CreateMarkerForm } from "~/app/_components/markers/create-marker-form"
import Markerlist from "~/app/_components/markers/markers-list"
import { DatePickerDemo } from "~/components/ui/date-picker"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "~/components/ui/select"


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
                        <DatePickerDemo />

                        <Select>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                {/* <SelectLabel>Status</SelectLabel> */}
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="RECORDING">Recording</SelectItem>
                                <SelectItem value="UNRECORDED">Unrecorded</SelectItem>
                                <SelectItem value="RECORDED">Recorded</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <Markerlist/>
            </div>
        </main>
    )
}

export const dynamic = 'force-dynamic';