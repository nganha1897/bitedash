import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Strings } from './../../enum/strings';
import { ModalController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { ResetPasswordComponent } from 'src/app/components/reset-password/reset-password.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule, ResetPasswordComponent]
})
export class LoginPage implements OnInit {

  @ViewChild('forgot_pwd_modal') modal: ModalController;
  type: boolean = true;
  isLogin = false;
  reset_pwd_model = {
    email: '',
    otp: '',
    new_password: ''
  };

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private global: GlobalService
  ) { }

  ngOnInit() {}

  changeType() {
    this.type = !this.type;
  }

  onSubmit(form: NgForm) {
    if(!form.valid) return;
    this.login(form);
  }

  login(form) {
    this.isLogin = true;
    this.authService.login(form.value.email, form.value.password).then(data => {
      this.navigate(data?.user?.type);
      this.isLogin = false;
      form.reset();
    })
    .catch(e => {
      this.isLogin = false;
      let msg = 'Could not sign in, please try again!';
      this.global.checkErrorMessageForAlert(e, msg);
    });
  }

  navigate(role?) {
    let url: string;
    if(role == Strings.USER_TYPE) url = Strings.TABS;
    else if(role == Strings.ADMIN_TYPE) url = Strings.ADMIN;
    else {
      this.authService.logout(true);
      return;
    }
    this.router.navigateByUrl(url, {replaceUrl: true});
  }

  reset(event) {
    this.reset_pwd_model = {
      email: '',
      otp: '',
      new_password: ''
    };
  }

  sendResetPasswordEmailOtp(email) {
    this.global.showLoader();
    this.authService.sendResetPasswordOtp(email).then(data => {
      this.reset_pwd_model = {...this.reset_pwd_model, email};
      this.global.hideLoader();
    })
    .catch(e => {
      this.global.hideLoader();
      let msg = 'Something went wrong, please try again!';
      this.global.checkErrorMessageForAlert(e, msg);
    });
  }

  verifyResetPasswordOtp(otp) {
    this.global.showLoader();
    this.authService.verifyResetPasswordOtp(this.reset_pwd_model.email, otp).then(data => {
      this.reset_pwd_model = {...this.reset_pwd_model, otp};
      this.global.hideLoader();
    })
    .catch(e => {
      this.global.hideLoader();
      let msg = 'Something went wrong, please try again!';
      this.global.checkErrorMessageForAlert(e, msg);
    }); 
  }

  resetPassword(new_password) {
    this.global.showLoader();
    this.reset_pwd_model = {...this.reset_pwd_model, new_password};
    this.authService.resetPassword(this.reset_pwd_model).then(data => {
      this.global.hideLoader();
      this.modal.dismiss();
      this.global.successToast('Your password is changed successfully. Please login now.');
    })
    .catch(e => {
      this.global.hideLoader();
      let msg = 'Something went wrong, please try again!';
      this.global.checkErrorMessageForAlert(e, msg);
    });
  }

}