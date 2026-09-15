import { AuthLayout } from '../../../layouts/AuthLayout';
import { ResetForm } from '../components/ResetForm.tsx';

export function ResetPage() {
    return (
        <AuthLayout
            title="Forgot Password"
        >
            <ResetForm />
        </AuthLayout>
    );
}
