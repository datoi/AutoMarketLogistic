import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import VehicleForm from './VehicleForm';

export default function Create() {
    const form = useForm({
        year: '', make: '', model: '', trim: '', price: '', mileage: '',
        condition: 'Good', status: 'In Transit', lot_number: '', location: '',
        engine: '', fuel_type: 'Gasoline', transmission: 'Automatic', vin: '',
        primary_damage: '', secondary_damage: '', highlights: '',
        existing_images: [], new_files: [],
        estimated_arrival: '', description: '', color: '', is_featured: false,
    });

    const submit = (e) => {
        e.preventDefault();
        form.post(route('admin.vehicles.store'), {
            forceFormData: true,
        });
    };

    return (
        <AuthenticatedLayout header={
            <div className="flex items-center gap-3">
                <Link href={route('admin.vehicles.index')} className="text-gray-500 hover:text-gray-700">← Vehicles</Link>
                <span className="text-gray-300">/</span>
                <h2 className="text-xl font-semibold text-gray-800">Add Vehicle</h2>
            </div>
        }>
            <Head title="Add Vehicle" />
            <div className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <VehicleForm form={form} onSubmit={submit} submitLabel="Create Vehicle" mode="create" />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
