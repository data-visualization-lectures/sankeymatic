
import React, { useState } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { saveProject } from '../../utils/cloudApi';

export default function CloudSaveModal({ show, onHide, getProjectData, getThumbnailBlob }) {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSave = async () => {
        if (!name.trim()) return;

        setLoading(true);
        setError(null);
        try {
            const projectData = getProjectData(); // This should return the JSON
            const thumbnailBlob = await getThumbnailBlob(); // Generate Thumbnail
            await saveProject(projectData, name, thumbnailBlob);
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                onHide();
                setName(''); // Reset name
            }, 1500);
        } catch (err) {
            console.error(err);
            setError('保存に失敗しました。ログイン状態を確認してください。');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>クラウドに保存</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">保存しました！</Alert>}

                <Form>
                    <Form.Group>
                        <Form.Label>プロジェクト名</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="例: 売上分析 2025"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            disabled={loading || success}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide} disabled={loading}>
                    キャンセル
                </Button>
                <Button variant="primary" onClick={handleSave} disabled={loading || success || !name.trim()}>
                    {loading ? <Spinner animation="border" size="sm" /> : '保存'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
