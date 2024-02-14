import { Injectable } from '@angular/core';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { ApiService } from '../api/api.service';
import { GlobalService } from '../global/global.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private _profile = new BehaviorSubject<User>(null);

  get profile() {
    return this._profile.asObservable();
  }

  constructor(
    private api: ApiService,
    private global: GlobalService
  ) { }

  async getProfile() {
    try {
      const profile_data = this._profile.value;
      if(!profile_data) {
        const profile: User = await lastValueFrom(this.api.get('user/profile'));
        return this.updateProfileData(profile);
      } else return profile_data;
    } catch(e) {
      this.global.checkMessageForErrorToast(e);
    }
  }

  async updatePhoneNumber(phone) {
    try {
      const profile: User = await lastValueFrom(this.api.patch('user/update/phone', { phone }));
      this.updateProfileData(profile);
      return profile;
    } catch(e) {
      this.global.checkMessageForErrorToast(e);
      return null;
    }
  }

  async updateProfile(param) {
    try {
      const profile_data = await lastValueFrom(this.api.patch('user/update/profile', {...param}));
      const profile: User = profile_data?.user;
      this.updateProfileData(profile);
      return profile_data;
    } catch(e) {
      throw(e);
    }
  }

  async updateProfilePic(formData) {
    try {
      const profile_data = await lastValueFrom(this.api.put('user/updateProfilePic', formData, true));
      const profile: User = profile_data;
      this.updateProfileData(profile);
      return profile_data;
    } catch(e) {
      throw(e);
    }
  }

  async resendOtp() {
    try {
      const response = await lastValueFrom(this.api.get('user/send/verification/email'));
      return response;
    } catch(e) {
      this.global.checkMessageForErrorToast(e);
    };
  }

  async verifyEmailOtp(data) {
    try {
      const response = await lastValueFrom(this.api.patch('user/verify/emailToken', data));
      let profile_data: User = this._profile.value;
      if(profile_data) {
        profile_data = { ...profile_data, email_verified: true };
        this.updateProfileData(profile_data);
      }
      return response;
    } catch(e) {
      this.global.checkMessageForErrorToast(e);
    }
  }

  updateProfileData(profile) {
    let data: any;
    if(profile) {
      data = new User(
        profile?.email,
        profile?.phone,
        profile?.name,
        profile?.type,
        profile?.status,
        profile?.email_verified,
      );
    } else data = profile;
    this._profile.next(data);
    return data;
  }
}
