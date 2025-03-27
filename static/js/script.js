$(document).ready(function() {
    const API_BASE_URL = 'http://localhost:8000/api';
    let authToken = localStorage.getItem('authToken');

    if (!authToken) {
        window.location.href = 'login.html';
        return;
    }

    function loadTasks(status = 'all') {
        let url = `${API_BASE_URL}/tasks/`;
        if (status !== 'all') {
            url += `?status=${status}`;
        }

        $.ajax({
            url: url,
            method: 'GET',
            headers: {
                'Authorization': `Token ${authToken}`
            },
            xhrFields: {
                withCredentials: true
            },
            success: function(response) {
                // Statusa görə filtrlə
                let filteredTasks = response;
                if (status === 'pending') {
                    filteredTasks = response.filter(task => task.status === 'pending');
                } else if (status === 'completed') {
                    filteredTasks = response.filter(task => task.status === 'completed');
                }
                renderTasks(filteredTasks);
            },
            error: function(xhr) {
                if (xhr.status === 401) {
                    localStorage.removeItem('authToken');
                    window.location.href = 'login.html';
                } else {
                    console.error('Xəta:', xhr.responseText);
                    alert('Tapşırıqlar yüklənərkən xəta baş verdi');
                }
            }
        });
    }

    function renderTasks(tasks) {
        $('#taskList').empty();
        if (tasks.length === 0) {
            $('#taskList').append('<div class="list-group-item text-center">Tapşırıq tapılmadı</div>');
            return;
        }

        tasks.forEach(task => {
            const taskItem = $(`
                <div class="list-group-item ${task.status === 'completed' ? 'completed' : ''}" data-id="${task.id}">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h5 class="task-title mb-1">${task.title}</h5>
                            <p class="mb-1">${task.content}</p>
                            <small class="text-muted">Yaradılma: ${new Date(task.created_at).toLocaleString()}</small>
                        </div>
                        <div class="d-flex align-items-center">
                            <div class="form-check form-switch me-3">
                                <input class="form-check-input status-toggle" type="checkbox" 
                                    id="status-${task.id}" ${task.status === 'completed' ? 'checked' : ''}>
                                <label class="form-check-label" for="status-${task.id}">
                                    ${task.status === 'completed' ? 'Tamamlandı' : 'Gözləyir'}
                                </label>
                            </div>
                            <button class="btn btn-sm btn-danger delete-btn">Sil</button>
                        </div>
                    </div>
                </div>
            `);

            $('#taskList').append(taskItem);
        });
    }

    $('#taskForm').submit(function(e) {
        e.preventDefault();
        const title = $('#title').val();
        const content = $('#content').val();

        if (!title || !content) {
            alert('Başlıq və məzmun tələb olunur');
            return;
        }

        $.ajax({
            url: `${API_BASE_URL}/tasks/`,
            method: 'POST',
            headers: {
                'Authorization': `Token ${authToken}`,
                'Content-Type': 'application/json'
            },
            xhrFields: {
                withCredentials: true
            },
            data: JSON.stringify({
                title: title,
                content: content,
                status: 'pending'
            }),
            success: function() {
                $('#title').val('');
                $('#content').val('');
                $('#addTaskModal').modal('hide');
                loadTasks($('#statusFilter').val());
            },
            error: function(xhr) {
                console.error('Xəta:', xhr.responseText);
                alert('Tapşırıq yaradılarkən xəta baş verdi');
            }
        });
    });

    $('#statusFilter').change(function() {
        loadTasks($(this).val());
    });

    $(document).on('change', '.status-toggle', function() {
        const taskId = $(this).closest('.list-group-item').data('id');
        const newStatus = $(this).is(':checked') ? 'completed' : 'pending';

        $.ajax({
            url: `${API_BASE_URL}/tasks/${taskId}/`,
            method: 'PATCH',
            headers: {
                'Authorization': `Token ${authToken}`,
                'Content-Type': 'application/json'
            },
            xhrFields: {
                withCredentials: true
            },
            data: JSON.stringify({
                status: newStatus
            }),
            success: function() {
                loadTasks($('#statusFilter').val());
            },
            error: function(xhr) {
                console.error('Xəta:', xhr.responseText);
                alert('Status dəyişdirilərkən xəta baş verdi');
            }
        });
    });

    $(document).on('click', '.delete-btn', function() {
        const taskId = $(this).closest('.list-group-item').data('id');

        if (confirm('Bu tapşırığı silmək istədiyinizə əminsiniz?')) {
            $.ajax({
                url: `${API_BASE_URL}/tasks/${taskId}/`,
                method: 'DELETE',
                headers: {
                    'Authorization': `Token ${authToken}`
                },
                xhrFields: {
                    withCredentials: true
                },
                success: function() {
                    loadTasks($('#statusFilter').val());
                },
                error: function(xhr) {
                    console.error('Xəta:', xhr.responseText);
                    alert('Tapşırıq silinərkən xəta baş verdi');
                }
            });
        }
    });

    $('#logout').click(function(e) {
        e.preventDefault();
        localStorage.removeItem('authToken');
        window.location.href = 'login.html';
    });

    loadTasks();
}); 