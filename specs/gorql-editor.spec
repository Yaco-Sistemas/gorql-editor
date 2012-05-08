%define name gorql-editor
%define sourcedir $(echo $PWD)
%define installdir /opt/%{name}
%define docdir /usr/share/doc/%{name}-%{version}

Name: %{name}
Version: 1.0.0develhg140
Release: 1
Summary: GORQL Editor helps writing SPARQL queries
Packager: Alejandro Blanco <ablanco@yaco.es>
Group: Applications/Internet
License: EUPL 1.1 License
# Copyright 2012 Yaco Sistemas S.L.
URL: http://www.yaco.es
Source0: %{name}-%{version}.tar.gz
BuildRoot: %{_tmppath}/%{name}-%{version}-%{release}-root
Requires: nodejs = 0.6.17, make
BuildRequires: nodejs = 0.6.17, npm, make

%description
%{summary}

%prep
%setup -q
mkdir %{installdir}

%build
cp -R * %{installdir}
cd %{installdir}
mkdir .forever
npm install -d
cd %{installdir}/public/javascripts/
make all

# clean files not needed
rm -rf %{installdir}/.hg
rm -f %{installdir}/%{name}.spec
rm -f %{installdir}/make_dev_rpm.sh

%install
# move the rest to the build root
mkdir -p `dirname $RPM_BUILD_ROOT%{installdir}`
mkdir -p $RPM_BUILD_ROOT%{docdir}
mv %{installdir}/INSTALL.rst $RPM_BUILD_ROOT%{docdir}/
mv %{installdir}/COPYING $RPM_BUILD_ROOT%{docdir}/
mv %{installdir}/README $RPM_BUILD_ROOT%{docdir}/
mv %{installdir} `dirname $RPM_BUILD_ROOT%{installdir}`/

# create empty directory to put symlinks later
mkdir -p $RPM_BUILD_ROOT/etc/%{name}

%clean
rm -rf $RPM_BUILD_ROOT

%files
%doc %{docdir}/INSTALL.rst
%doc %{docdir}/COPYING
%doc %{docdir}/README
%{installdir}/node_modules
%{installdir}/client
%{installdir}/public
%{installdir}/routes
%{installdir}/i18n
%{installdir}/endpoints
%{installdir}/views
%{installdir}/app.js
%{installdir}/package.json
%attr(755,%{name},%{name}) %{installdir}/.forever
%config %attr(755,%{name},%{name}) %{installdir}/settings.js
/etc/%{name}
%attr(755,%{name},%{name}) %{installdir}/%{name}.sh

%pre
# check if this the first installation
if [ $1 = 1 ]; then
# create group and user
    getent group %{name} || groupadd -r %{name}
    getent passwd %{name} || useradd -d %{installdir} -g %{name} -M -r -s /sbin/nologin %{name}
fi

%post
if [ ! -e /etc/init.d/%{name} ]; then
    ln -s %{installdir}/%{name}.sh /etc/init.d/%{name}
fi

if [ ! -e /etc/%{name}/settings.js ]; then
    ln -s %{installdir}/settings.js /etc/%{name}/settings.js
fi

%preun
if [ $1 = 0 ]; then
   rm -f /etc/init.d/%{name}
   rm -f /etc/%{name}/settings.js
fi

%postun
if [ $1 = 0 ]; then
    getent passwd %{name} > /dev/null && userdel %{name}
fi

%changelog

* Fri Mar 09 2012 Alejandro Blanco <ablanco@yaco.es>
- Initial version
