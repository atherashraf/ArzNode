from django.contrib.admin import AdminSite

AdminSite.site_header = "Digital Arz Admin"
AdminSite.site_title = "Digital Arz Admin Portal"
AdminSite.index_title = "Welcome to Digital Arz Admin Portal"

# class AcademicsAdminSite(AdminSite):
#     site_header = 'PUCIT Academics'
#     site_title = 'PUCIT Academics Portal'
#     index_title = "Welcome to Academic Admin Portal"
#
# academics_admin_site = AcademicsAdminSite(name='academics_admin')
#
# class TeacherAdminSite(AdminSite):
#     site_header = 'PUCIT Teacher'
#     site_title =  'PUCIT Teachers Portal'
#     # user_name = User.username
#     index_title = "Welcome to Teachers Portal" #%user_name
#
# teacher_admin_site = TeacherAdminSite(name='teachers_admin')