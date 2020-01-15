from django import forms

from digitalarz.utils import Common_Utils
from spatial_app.local_settings import CATEGORY_CHOICES


class ModelLayerForm(forms.Form):
    app_label = forms.ChoiceField(label='App Name',  # widget=forms.SelectMultiple(attrs={id:'cmbAppLabel'})
                                  choices=[(label, label) for label in Common_Utils.get_project_app()])
    model_name = forms.ChoiceField(label='Model Name', widget=forms.Select(attrs={id: 'cmbModelName'}))
    category = forms.ChoiceField(label='Main Category', choices=CATEGORY_CHOICES)


class UploadShapeFileForm(forms.Form):
    shp_file = forms.FileField(widget=forms.FileInput(attrs={'accept': '.shp'}))
    shx_file = forms.FileField(widget=forms.FileInput(attrs={'accept': '.shx'}))
    dbf_file = forms.FileField(widget=forms.FileInput(attrs={'accept': '.dbf'}))
    prj_file = forms.FileField(widget=forms.FileInput(attrs={'accept': '.prj'}))
