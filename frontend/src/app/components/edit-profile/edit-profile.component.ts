import { AuthService } from 'src/app/services/auth/auth.service';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { GlobalService } from 'src/app/services/global/global.service';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class EditProfileComponent implements OnInit {

  @Input() profile;
  isSubmitted = false;
  @ViewChild('phoneInput') phoneInput;

  constructor(
    private profileService: ProfileService,
    private global: GlobalService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.phoneInput.setFocus();
    }, 500);
  }

  async onSubmit(form: NgForm) {
    try {
      if(!form.valid) {
        return;
      }
      this.isSubmitted = true;
      if(this.profile.email != form.value.email) {
        this.presentPasswordPrompt(form.value);
      } else {
        await this.profileService.updatePhoneNumber(form.value.phone);
        this.global.modalDismiss();
        this.isSubmitted = false;
      }
    } catch(e) {
      this.global.checkMessageForErrorToast(e);
      this.isSubmitted = false;
    }
  }

  presentPasswordPrompt(data) {
    this.global.showAlert(
      'Please enter your password to change your email address',
      'Verify',
      [{
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          this.isSubmitted = false;
        }
      }, {
        text: 'Verify',
        handler: (inputData) => {
          if(inputData.password.trim() != '' && inputData.password.length >= 8) {
            this.updateEmail(data, inputData.password);
          } else {
            this.global.errorToast('Password must be of at least 8 characters');
          }
        }
      }],
      [{
        name: 'password',
        type: 'password',
        placeholder: 'Enter Password',
      }]
    );
  }

  async updateEmail(data, password) {
    try {
      const profile_data = {
        phone: data.phone,
        email: data.email,
        password: password
      };
      const updated_data = await this.profileService.updateProfile(profile_data);
      await this.auth.setUserData(updated_data?.token, updated_data?.refreshToken);
      this.global.modalDismiss(true);
      this.isSubmitted = false;
    } catch(e) {
      this.global.checkMessageForErrorToast(e);
      this.isSubmitted = false;
    }
  }

}

