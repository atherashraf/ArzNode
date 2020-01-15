from django.urls import reverse


def add_base_navbar_items_to_context(request):
    next_page = request.GET['next'] if 'next' in request.GET else None
    navbarItems = []  # {"name": "Home", "href": reverse('home')}
    dropdownItems = [];
    if request.path == reverse('home'):
        get_digitalarz_navbar_items(request.user, navbarItems, dropdownItems)
    # elif reverse('academics_home') in request.path:
    #     get_academics_navbar_items(request.user, navbarItems, dropdownItems)

    dropdownItems.append({"name": "Signout", "href": reverse("logout"), "fa": "fas fa-sign-out-alt"})
    return {
        'navbarItems': navbarItems,
        'dropdownItems': dropdownItems,
        'next_page': next_page
    }


def get_digitalarz_navbar_items(user, navbaritems, dropdownItems):
    navbaritems.append({"name": "Home", "href": '/'})
    #     navbaritems.append({"name": "Course Allocation", "href": reverse('allocation_home')})
    if user.is_superuser:
        dropdownItems.append({"name": "Manage", "href": reverse("admin:index"), "fa": "fas fa-database"});

# def get_academics_navbar_items(user, navbarItems, dropdownItems):
#     if user:
#         dropdownItems.append({"name": "Signout", "href": reverse("logout"), "fa": "fa fa-sign-out"})
#         if user.is_staff:
#             if user.is_superuser:
#                 dropdownItems.append({"name": "Manage", "href": reverse("admin:index"), "fa": "fa fa-dashboard"})
#             if user.is_superuser or user.groups.filter(name="Academic_Group").exists():
#                 dropdownItems.append({"name": "Manage Academics", "href": "/academics_admin/", "fa": "fa fa-dashboard"})
#             if user.is_superuser or user.groups.filter(name="course_allocation").exists():
#                 dropdownItems.append({"name": "Manage Academics", "href": "/academics_admin/", "fa": "fa fa-dashboard"})
#                 navbarItems.append({"name":"Course Allocation", "href": reverse("academics_course_allocation")})
#             # if user.is_superuser or user.groups.filter(name="Teachers_Group").exists():
#                 # navbarItems.append({"name": "Teachers", "href": reverse("teacher_home")})
#                 # dropdownItems.append({"name": "Manage Teacher", "href": "/teachers_admin/", "fa": "fa fa-dashboard"})
#             # if user.is_superuser or user.groups.filter(name="Students_Group").exists():
#             #     navbarItems.append({"name": "Students", "href": reverse('student_home')})
