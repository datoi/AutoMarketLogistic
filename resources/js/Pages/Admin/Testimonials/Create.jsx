import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TestimonialForm from './TestimonialForm';

export default function Create() {
    const form = useForm({
        name: '',
        city: '',
        vehicle_label: '',
        quote: '',
        rating: 5,
        is_active: true,
        sort_order: 0,
        photo: null,
    });

    const submit = (e) => {
        e.preventDefault();
        form.post(route('admin.testimonials.store'), {
            forceFormData: true,
        });
    };

    return (
        <AuthenticatedLayout header={
            <div className="flex items-center gap-3">
                <Link href={route('admin.testimonials.index')} className="text-gray-500 hover:text-gray-700">← Testimonials</Link>
                <span className="text-gray-300">/</span>
                <h2 className="text-xl font-semibold text-gray-800">Add Testimonial</h2>
            </div>
        }>
            <Head title="Add Testimonial" />
            <div className="py-6">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <TestimonialForm form={form} onSubmit={submit} submitLabel="Create Testimonial" />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
