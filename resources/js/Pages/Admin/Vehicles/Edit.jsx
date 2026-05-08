import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import VehicleForm from './VehicleForm';

export default function Edit({ vehicle }) {
    const form = useForm({
        year:               String(vehicle.year),
        make:               vehicle.make,
        model:              vehicle.model,
        trim:               vehicle.trim ?? '',
        price:              String(vehicle.price),
        mileage:            String(vehicle.mileage),
        condition:          vehicle.condition,
        status:             vehicle.status,
        lot_number:         vehicle.lot_number,
        location:           vehicle.location ?? '',
        engine:             vehicle.engine ?? '',
        fuel_type:          vehicle.fuel_type ?? 'Gasoline',
        transmission:       vehicle.transmission ?? 'Automatic',
        vin:                vehicle.vin,
        primary_damage:     vehicle.primary_damage ?? '',
        secondary_damage:   vehicle.secondary_damage ?? '',
        highlights:         (vehicle.highlights ?? []).join('\n'),
        existing_images:    (vehicle.images ?? []).map((i) => i.url),
        new_files:          [],
        estimated_arrival:  vehicle.estimated_arrival ?? '',
        description:        vehicle.description ?? '',
        color:              vehicle.color ?? '',
        is_featured:        vehicle.is_featured ?? false,
    });

    const submit = (e) => {
        e.preventDefault();
        // File uploads with PUT need POST + `_method` spoofing on the Laravel side.
        // Don't chain `.transform(...).post(...)` — useForm().transform() returns void
        // in this Inertia version, so the chain throws "Cannot read properties of
        // undefined (reading 'post')" and the Save button silently does nothing.
        form.transform((data) => ({ ...data, _method: 'put' }));
        form.post(route('admin.vehicles.update', vehicle.id), {
            forceFormData: true,
        });
    };

    return (
        <AuthenticatedLayout header={
            <div className="flex items-center gap-3">
                <Link href={route('admin.vehicles.index')} className="text-gray-500 hover:text-gray-700">← Vehicles</Link>
                <span className="text-gray-300">/</span>
                <h2 className="text-xl font-semibold text-gray-800">Edit Vehicle</h2>
            </div>
        }>
            <Head title="Edit Vehicle" />
            <div className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <VehicleForm form={form} onSubmit={submit} submitLabel="Save Changes" mode="edit" />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
